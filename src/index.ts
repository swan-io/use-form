import {
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";

// For server-side rendering / react-native
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type AnyRecord = Record<string, unknown>;

export type ValidatorResult<ErrorMessage = string> =
  | ErrorMessage
  | void
  | Promise<ErrorMessage | void>;

export type Validator<Value, ErrorMessage = string> = (
  value: Value,
) => ValidatorResult<ErrorMessage>;

export type FormStatus = "untouched" | "editing" | "submitting" | "submitted";

// Kudos to https://github.com/MinimaHQ/re-formality/blob/master/docs/02-ValidationStrategies.md
export type Strategy = "onChange" | "onSuccess" | "onBlur" | "onSuccessOrBlur" | "onSubmit";

export type FieldState<Value, ErrorMessage = string> = {
  value: Value;
  validating: boolean;
  valid: boolean;
  error: ErrorMessage | undefined;
};

export type FormConfig<Values extends AnyRecord, ErrorMessage = string> = {
  [N in keyof Values]: {
    initialValue: Values[N];
    strategy?: Strategy;
    debounceInterval?: number;
    isEqual?: (valueBeforeValidate: Values[N], valueAfterValidate: Values[N]) => boolean;
    sanitize?: (value: Values[N]) => Values[N];
    validate?: (
      value: Values[N],
      helpers: {
        focusField: (name: keyof Values) => void;
        getFieldState: <N extends keyof Values>(
          name: N,
          options?: { sanitize?: boolean },
        ) => FieldState<Values[N], ErrorMessage>;
      },
    ) => ValidatorResult<ErrorMessage>;
  };
};

export type Form<Values extends AnyRecord, ErrorMessage = string> = {
  formStatus: FormStatus;

  Field: (<N extends keyof Values>(props: {
    name: N;
    children: (
      props: FieldState<Values[N], ErrorMessage> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref: MutableRefObject<any>;
        onChange: (value: Values[N]) => void;
        onBlur: () => void;
      },
    ) => ReactElement | null;
  }) => ReactElement | null) & {
    displayName?: string;
  };

  FieldsListener: (<N extends keyof Values>(props: {
    names: N[];
    children: (states: {
      [N1 in N]: FieldState<Values[N1], ErrorMessage>;
    }) => ReactElement | null;
  }) => ReactElement | null) & {
    displayName?: string;
  };

  getFieldState: <N extends keyof Values>(
    name: N,
    options?: { sanitize?: boolean },
  ) => FieldState<Values[N], ErrorMessage>;
  setFieldValue: <N extends keyof Values>(
    name: N,
    value: Values[N],
    options?: { validate?: boolean },
  ) => void;
  setFieldError: (name: keyof Values, error?: ErrorMessage) => void;

  focusField: (name: keyof Values) => void;
  resetField: (name: keyof Values) => void;
  sanitizeField: (name: keyof Values) => void;
  validateField: (name: keyof Values) => Promise<ErrorMessage | void>;

  listenFields: <N extends keyof Values>(
    names: N[],
    listener: (states: { [N1 in N]: FieldState<Values[N1], ErrorMessage> }) => void,
  ) => () => void;

  resetForm: () => void;
  submitForm: (options?: {
    onSuccess?: (values: Partial<Values>) => Promise<unknown> | void;
    onFailure?: (errors: Partial<Record<keyof Values, ErrorMessage>>) => Promise<unknown> | void;
    shouldFocusOnError?: boolean;
  }) => void;
};

const identity = <T>(value: T) => value;
const noop = () => {};

const isPromise = <T>(value: unknown): value is Promise<T> =>
  !!value &&
  (typeof value === "object" || typeof value === "function") &&
  typeof (value as { then?: () => void }).then === "function";

export const combineValidators =
  <Value, ErrorMessage = string>(
    ...validators: (Validator<Value, ErrorMessage> | false)[]
  ): Validator<Value, ErrorMessage> =>
  (value) => {
    const [validator, ...nextValidators] = validators;

    if (validator) {
      const result = validator(value);

      if (isPromise(result)) {
        return result.then((error) => {
          if (typeof error !== "undefined") {
            return error;
          }
          if (nextValidators.length > 0) {
            return combineValidators(...nextValidators)(value);
          }
        });
      }

      if (typeof result !== "undefined") {
        return result;
      }
    }

    if (nextValidators.length > 0) {
      return combineValidators(...nextValidators)(value);
    }
  };

const isEmptyString = (value: unknown) => value === "";

export const toOptionalValidator =
  <Value, ErrorMessage = string>(
    validator: Validator<Value, ErrorMessage>,
    ...args: Value extends string
      ? [isEmptyValue?: (value: Value) => boolean]
      : [isEmptyValue: (value: Value) => boolean]
  ): Validator<Value, ErrorMessage> =>
  (value) => {
    const [isEmptyValue = isEmptyString] = args;

    if (!isEmptyValue(value)) {
      return validator(value);
    }
  };

export const hasDefinedKeys = <T extends AnyRecord, K extends keyof T = keyof T>(
  object: T,
  keys: K[],
): object is T & {
  [K1 in K]-?: Exclude<T[K1], undefined>;
} => keys.every((key) => typeof object[key] !== "undefined");

export const useForm = <Values extends AnyRecord, ErrorMessage = string>(
  fields: FormConfig<Values, ErrorMessage>,
): Form<Values, ErrorMessage> => {
  type Contract = Form<Values, ErrorMessage>;
  type Name = keyof Values;

  const [, forceUpdate] = useReducer(() => [], []);
  const mounted = useRef(false);
  const config = useRef(fields);
  const formStatus = useRef<FormStatus>("untouched");

  useIsoLayoutEffect(() => {
    config.current = fields;
  });

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  type StateMap = {
    [N in Name]: Readonly<{
      exposed: FieldState<Values[N], ErrorMessage>;
      talkative: boolean;
      validity:
        | { readonly tag: "unknown" }
        | { readonly tag: "validating" }
        | { readonly tag: "valid" }
        | { readonly tag: "invalid"; error: ErrorMessage };
    }>;
  };

  const states = useRef() as MutableRefObject<StateMap>;

  type CallbackMap = Record<Name, Set<() => void>>;
  type MountedMap = Record<Name, boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type RefMap = Record<Name, MutableRefObject<any>>;
  type TimeoutMap = Record<Name, number | undefined>;

  const callbacks = useRef() as MutableRefObject<CallbackMap>;
  const mounteds = useRef() as MutableRefObject<MountedMap>;
  const refs = useRef() as MutableRefObject<RefMap>;
  const timeouts = useRef() as MutableRefObject<TimeoutMap>;

  const field = useRef() as MutableRefObject<Contract["Field"]>;
  const fieldsListener = useRef() as MutableRefObject<Contract["FieldsListener"]>;

  const api = useMemo(() => {
    const getDebounceInterval = (name: Name) => config.current[name].debounceInterval ?? 0;
    const getIsEqual = (name: Name) => config.current[name].isEqual ?? Object.is;
    const getInitialValue = (name: Name) => config.current[name].initialValue;
    const getSanitize = (name: Name) => config.current[name].sanitize ?? identity;
    const getStrategy = (name: Name) => config.current[name].strategy ?? "onSuccessOrBlur";
    const getValidate = (name: Name) => config.current[name].validate ?? noop;

    const isMounted = (name: Name) => mounteds.current[name];
    const isTalkative = (name: Name) => states.current[name].talkative;

    const setState = <N extends Name>(
      name: N,
      state: SetStateAction<{ value: Values[N] } & Pick<StateMap[N], "talkative" | "validity">>,
    ) => {
      const currentState = states.current[name];

      const nextState =
        typeof state === "function"
          ? state({
              value: currentState.exposed.value,
              talkative: currentState.talkative,
              validity: currentState.validity,
            })
          : state;

      const exposed =
        !nextState.talkative || nextState.validity.tag === "unknown"
          ? // Avoid giving feedback too soon
            {
              validating: false,
              valid: !getValidate(name),
              error: undefined,
            }
          : {
              validating: nextState.validity.tag === "validating",
              valid: nextState.validity.tag === "valid",
              error: nextState.validity.tag === "invalid" ? nextState.validity.error : undefined,
            };

      states.current[name] = {
        talkative: nextState.talkative,
        validity: nextState.validity,
        exposed: { ...exposed, value: nextState.value },
      };
    };

    const clearDebounceTimeout = (name: Name): boolean => {
      const timeout = timeouts.current[name];
      const debounced = typeof timeout !== "undefined";

      if (debounced) {
        clearTimeout(timeout);
        timeouts.current[name] = undefined;
      }

      return debounced;
    };

    const runRenderCallbacks = (name: Name): void => {
      callbacks.current[name].forEach((callback) => callback());
    };

    const setTalkative = (name: Name, strategies?: Strategy[]): void => {
      const strategy = getStrategy(name);

      if (!strategies || strategies.some((item) => strategy === item)) {
        setState(name, (prevState) => ({
          ...prevState,
          talkative: true,
        }));
      }
    };

    const setValidating = (name: Name): void => {
      setState(name, (prevState) => ({
        ...prevState,
        validity: { tag: "validating" },
      }));
    };

    const setError = (name: Name, error: ErrorMessage | void): void => {
      setState(name, (prevState) => ({
        ...prevState,
        validity: typeof error !== "undefined" ? { tag: "invalid", error } : { tag: "valid" },
      }));
    };

    const getFieldState = <N extends Name>(
      name: N,
      options: { sanitize?: boolean } = {},
    ): FieldState<Values[N], ErrorMessage> => {
      const { exposed } = states.current[name];

      if (!options.sanitize) {
        return exposed;
      }

      const sanitize = getSanitize(name);

      return {
        ...exposed,
        value: sanitize(exposed.value) as Values[N],
      };
    };

    const internalValidateField = <N extends Name>(name: N): ValidatorResult<ErrorMessage> => {
      const debounced = clearDebounceTimeout(name);

      const sanitizeAtStart = getSanitize(name);
      const validate = getValidate(name);
      const valueAtStart = sanitizeAtStart(states.current[name].exposed.value);

      const promiseOrError = validate(valueAtStart, {
        getFieldState,
        focusField,
      });

      if (!isPromise(promiseOrError)) {
        const error = promiseOrError;

        if (error === undefined) {
          setTalkative(name, ["onSuccess", "onSuccessOrBlur"]);
        }

        setError(name, error);
        runRenderCallbacks(name);

        return error;
      }

      if (!debounced) {
        setValidating(name);
        runRenderCallbacks(name);
      }

      return promiseOrError
        .then((error) => {
          const isEqual = getIsEqual(name);
          const valueAtEnd = sanitizeAtStart(states.current[name].exposed.value);

          if (!isEqual(valueAtStart, valueAtEnd)) {
            return;
          }
          if (error === undefined) {
            setTalkative(name, ["onSuccess", "onSuccessOrBlur"]);
          }

          setError(name, error);
          runRenderCallbacks(name);

          return error;
        })
        .catch((error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(
              `Something went wrong during "${String(
                name,
              )}" validation. Don't forget to handle Promise rejection.\n`,
              error,
            );
          }
        });
    };

    const setFieldValue: Contract["setFieldValue"] = (name, value, options = {}) => {
      setState(name, (prevState) => ({
        ...prevState,
        value,
      }));

      if (Boolean(options.validate)) {
        setTalkative(name);
      }

      void internalValidateField(name);
    };

    const setFieldError: Contract["setFieldError"] = (name, error) => {
      setError(name, error);
      setTalkative(name);
      runRenderCallbacks(name);
    };

    const focusField: Contract["focusField"] = (name) => {
      const ref = refs.current[name];

      if (ref.current && typeof ref.current.focus === "function") {
        ref.current.focus();
      }
    };

    const resetField: Contract["resetField"] = (name) => {
      clearDebounceTimeout(name);

      setState(name, () => ({
        value: getInitialValue(name),
        talkative: false,
        validity: { tag: "unknown" },
      }));

      runRenderCallbacks(name);
    };

    const sanitizeField: Contract["sanitizeField"] = (name) => {
      const sanitize = getSanitize(name);

      setState(name, ({ talkative, value, validity }) => ({
        value: sanitize(value),
        talkative,
        validity,
      }));

      runRenderCallbacks(name);
    };

    const validateField: Contract["validateField"] = (name) => {
      if (!isMounted(name)) {
        return Promise.resolve(undefined);
      }

      setTalkative(name);
      return Promise.resolve(internalValidateField(name));
    };

    const listenFields: Contract["listenFields"] = (names, listener) => {
      const callback = () => {
        listener(
          names.reduce(
            (acc, name) => {
              acc[name] = getFieldState(name);
              return acc;
            },
            {} as {
              [N1 in (typeof names)[number]]: FieldState<Values[N1], ErrorMessage>;
            },
          ),
        );
      };

      names.forEach((name) => callbacks.current[name].add(callback));

      return () => {
        names.forEach((name) => callbacks.current[name].delete(callback));
      };
    };

    const getOnChange =
      <N extends Name>(name: N) =>
      (value: Values[N]): void => {
        const debounceInterval = getDebounceInterval(name);

        setState(name, (prevState) => ({
          ...prevState,
          value,
        }));

        setTalkative(name, ["onChange"]);
        clearDebounceTimeout(name);

        if (formStatus.current === "untouched" || formStatus.current === "submitted") {
          formStatus.current = "editing";
          forceUpdate();
        }

        if (debounceInterval === 0) {
          void internalValidateField(name);
          return;
        }

        setValidating(name);
        runRenderCallbacks(name);

        timeouts.current[name] = setTimeout(() => {
          if (isMounted(name)) {
            void internalValidateField(name);
          } else {
            clearDebounceTimeout(name);
          }
        }, debounceInterval) as unknown as number;
      };

    const getOnBlur = (name: Name) => (): void => {
      const { validity } = states.current[name];

      // Avoid validating an untouched / already valid field
      if (validity.tag !== "unknown" && !isTalkative(name)) {
        setTalkative(name, ["onBlur", "onSuccessOrBlur"]);
        void internalValidateField(name);
      }
    };

    const resetForm: Contract["resetForm"] = () => {
      Object.keys(config.current).forEach((name) => resetField(name));

      formStatus.current = "untouched";
      forceUpdate();
    };

    const isSyncSubmission = (
      results: ValidatorResult<ErrorMessage>[],
    ): results is (ErrorMessage | undefined)[] => results.every((result) => !isPromise(result));

    const focusFirstError = (names: Name[], results: (ErrorMessage | undefined)[]) => {
      const index = results.findIndex((result) => typeof result !== "undefined");
      const name = names[index];

      if (typeof name !== "undefined") {
        focusField(name);
      }
    };

    const handleEffect = (effect: Promise<unknown> | void, wasEditing: boolean) => {
      if (isPromise(effect)) {
        forceUpdate();

        void effect.finally(() => {
          formStatus.current = "submitted";

          if (mounted.current) {
            forceUpdate();
          }
        });
      } else {
        formStatus.current = "submitted";

        if (wasEditing) {
          forceUpdate(); // Only needed to rerender and switch from editing to submitted
        }
      }
    };

    const submitForm: Contract["submitForm"] = ({
      onSuccess = noop,
      onFailure = noop,
      // autofocusing first error is the default behaviour
      shouldFocusOnError = true,
    } = {}) => {
      if (formStatus.current === "submitting") {
        return; // Avoid concurrent submissions
      }

      const wasEditing = formStatus.current === "editing";
      formStatus.current = "submitting";

      const names: Name[] = Object.keys(mounteds.current).filter((name) => mounteds.current[name]);
      const values: Partial<Values> = {};
      const errors: Partial<Record<Name, ErrorMessage>> = {};
      const results: ValidatorResult<ErrorMessage>[] = [];

      names.forEach((name: Name, index) => {
        setTalkative(name);
        values[name] = getFieldState(name, { sanitize: true }).value;
        results[index] = internalValidateField(name);
      });

      if (isSyncSubmission(results)) {
        const success = results.every((result) => typeof result === "undefined");

        if (success) {
          return handleEffect(onSuccess(values), wasEditing);
        }

        if (shouldFocusOnError) {
          focusFirstError(names, results);
        }

        names.forEach((name, index) => {
          errors[name] = results[index];
        });

        return handleEffect(onFailure(errors), wasEditing);
      }

      forceUpdate(); // submit is async: we need to give visual feedback

      void Promise.all(results.map((result) => Promise.resolve(result)))
        .then((uncasted) => {
          const results = uncasted as (ErrorMessage | undefined)[];
          const success = results.every((result) => typeof result === "undefined");

          if (success) {
            return handleEffect(onSuccess(values), wasEditing);
          }

          if (shouldFocusOnError) {
            focusFirstError(names, results);
          }

          names.forEach((name, index) => {
            errors[name] = results[index];
          });

          return handleEffect(onFailure(errors), wasEditing);
        })
        .finally(() => {
          formStatus.current = "submitted";
          mounted.current && forceUpdate();
        });
    };

    return {
      getFieldState,
      setFieldValue,
      setFieldError,
      focusField,
      resetField,
      sanitizeField,
      validateField,
      listenFields,

      resetForm,
      submitForm,

      setState,
      getOnChange,
      getOnBlur,
    };
  }, []);

  // Lazy initialization
  if (!states.current) {
    states.current = {} as StateMap;

    callbacks.current = {} as CallbackMap;
    mounteds.current = {} as MountedMap;
    refs.current = {} as RefMap;
    timeouts.current = {} as TimeoutMap;

    for (const name in config.current) {
      if (Object.prototype.hasOwnProperty.call(config.current, name)) {
        api.setState(name, {
          value: config.current[name].initialValue,
          talkative: false,
          validity: { tag: "unknown" },
        });

        callbacks.current[name] = new Set();
        mounteds.current[name] = false;
        refs.current[name] = { current: null };
        timeouts.current[name] = undefined;
      }
    }

    const Field: Contract["Field"] = ({ name, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => states.current[name],
          subscribe: (callback: () => void): (() => void) => {
            callbacks.current[name].add(callback);

            return () => {
              callbacks.current[name].delete(callback);
            };
          },
        }),
        [name],
      );

      useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      useEffect(() => {
        const isFirstMounting = !mounteds.current[name];

        if (isFirstMounting) {
          mounteds.current[name] = true;
        } else {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "Mounting multiple fields with identical names is not supported and will lead to errors",
            );
          }
        }

        return () => {
          if (isFirstMounting) {
            mounteds.current[name] = false;
          }
        };
      }, [name]);

      return children({
        ...api.getFieldState(name),
        ref: refs.current[name],
        onBlur: useMemo(() => api.getOnBlur(name), [name]),
        onChange: useMemo(() => api.getOnChange(name), [name]),
      });
    };

    Field.displayName = "Field";
    field.current = Field;

    const FieldsListener: Contract["FieldsListener"] = ({ names, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => JSON.stringify(names.map((name) => states.current[name])),
          subscribe: (callback: () => void): (() => void) => {
            names.forEach((name) => callbacks.current[name].add(callback));

            return () => {
              names.forEach((name) => callbacks.current[name].delete(callback));
            };
          },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(names)],
      );

      useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      return children(
        names.reduce(
          (acc, name) => {
            acc[name] = api.getFieldState(name);
            return acc;
          },
          {} as {
            [N1 in (typeof names)[number]]: FieldState<Values[N1], ErrorMessage>;
          },
        ),
      );
    };

    FieldsListener.displayName = "FieldsListener";
    fieldsListener.current = FieldsListener;
  }

  return {
    formStatus: formStatus.current,

    Field: field.current,
    FieldsListener: fieldsListener.current,

    getFieldState: api.getFieldState,
    setFieldValue: api.setFieldValue,
    setFieldError: api.setFieldError,
    focusField: api.focusField,
    resetField: api.resetField,
    sanitizeField: api.sanitizeField,
    validateField: api.validateField,
    listenFields: api.listenFields,

    resetForm: api.resetForm,
    submitForm: api.submitForm,
  };
};
