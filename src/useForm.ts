import {
  MutableRefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";
import { UNSET } from "./areValuesSet";
import { identity, isPromise, noop } from "./helpers";
import {
  AnyRecord,
  FieldState,
  Form,
  FormConfig,
  FormStatus,
  Strategy,
  UnsettableRecord,
  ValidatorResult,
  Validity,
} from "./types";

// For server-side rendering / react-native
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  const states = useRef() as MutableRefObject<{
    [N in Name]: {
      readonly callbacks: Set<() => void>;
      readonly ref: MutableRefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
      mounted: boolean;
      timeout: number | undefined;
      exposed: Readonly<{
        talkative: boolean;
        value: Values[N];
        validity: Validity<ErrorMessage>;
      }>;
    };
  }>;

  const field = useRef() as MutableRefObject<Contract["Field"]>;
  const fieldsListener = useRef() as MutableRefObject<Contract["FieldsListener"]>;

  const api = useMemo(() => {
    const getDebounceInterval = (name: Name) => config.current[name].debounceInterval ?? 0;
    const getInitialValue = (name: Name) => config.current[name].initialValue;
    const getIsEqual = (name: Name) => config.current[name].isEqual ?? Object.is;
    const getSanitize = <N extends Name>(name: N) => config.current[name].sanitize ?? identity;
    const getStrategy = (name: Name) => config.current[name].strategy ?? "onSuccessOrBlur";
    const getValidate = (name: Name) => config.current[name].validate ?? noop;

    const isMounted = (name: Name) => states.current[name].mounted;
    const isTalkative = (name: Name) => states.current[name].exposed.talkative;

    const setState = <N extends Name>(
      name: N,
      state: SetStateAction<{
        talkative: boolean;
        value: Values[N];
        validity: Validity<ErrorMessage>;
      }>,
    ) => {
      states.current[name].exposed =
        typeof state === "function" ? state(states.current[name].exposed) : state;
    };

    const getFieldState = <N extends Name>(
      name: N,
      options: { sanitize?: boolean } = {},
    ): FieldState<Values[N], ErrorMessage> => {
      const { sanitize = false } = options;
      const state = states.current[name].exposed;
      const value = sanitize ? getSanitize(name)(state.value) : state.value;

      return !state.talkative || state.validity.tag === "unknown"
        ? // Avoid giving feedback too soon
          {
            value,
            validating: false,
            valid: getValidate(name) === noop,
            error: undefined,
          }
        : {
            value,
            validating: state.validity.tag === "validating",
            valid: state.validity.tag === "valid",
            error: state.validity.tag === "invalid" ? state.validity.error : undefined,
          };
    };

    const clearDebounceTimeout = (name: Name): boolean => {
      const { timeout } = states.current[name];
      const debounced = typeof timeout !== "undefined";

      if (debounced) {
        clearTimeout(timeout);
        states.current[name].timeout = undefined;
      }

      return debounced;
    };

    const runRenderCallbacks = (name: Name): void => {
      states.current[name].callbacks.forEach((callback) => callback());
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

    const internalValidateField = <N extends Name>(name: N): ValidatorResult<ErrorMessage> => {
      const debounced = clearDebounceTimeout(name);

      const sanitizeAtStart = getSanitize(name);
      const validate = getValidate(name);
      const valueAtStart = sanitizeAtStart(getFieldState(name).value);

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
          const valueAtEnd = sanitizeAtStart(getFieldState(name).value);

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
      const { ref } = states.current[name];

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

      names.forEach((name) => states.current[name].callbacks.add(callback));

      return () => {
        names.forEach((name) => states.current[name].callbacks.delete(callback));
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

        states.current[name].timeout = setTimeout(() => {
          if (isMounted(name)) {
            void internalValidateField(name);
          } else {
            clearDebounceTimeout(name);
          }
        }, debounceInterval) as unknown as number;
      };

    const getOnBlur = (name: Name) => (): void => {
      const { validity } = states.current[name].exposed;

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
      focusOnFirstError = true,
    } = {}) => {
      if (formStatus.current === "submitting") {
        return; // Avoid concurrent submissions
      }

      const wasEditing = formStatus.current === "editing";
      formStatus.current = "submitting";

      const names: Name[] = Object.keys(states.current);
      const values = {} as UnsettableRecord<Values>;
      const errors: Partial<Record<Name, ErrorMessage>> = {};
      const results: ValidatorResult<ErrorMessage>[] = [];

      names.forEach((name: Name, index) => {
        if (isMounted(name)) {
          setTalkative(name);
          values[name] = getFieldState(name, { sanitize: true }).value;
          results[index] = internalValidateField(name);
        } else {
          values[name] = UNSET;
        }
      });

      if (isSyncSubmission(results)) {
        const success = results.every((result) => typeof result === "undefined");

        if (success) {
          return handleEffect(onSuccess(values), wasEditing);
        }

        if (focusOnFirstError) {
          focusFirstError(names, results);
        }

        names.forEach((name, index) => {
          errors[name] = results[index];
        });

        return handleEffect(onFailure(errors), wasEditing);
      }

      forceUpdate(); // Async validation flow: we need to give visual feedback

      void Promise.all(results.map((result) => Promise.resolve(result)))
        .then((uncasted) => {
          const results = uncasted as (ErrorMessage | undefined)[];
          const success = results.every((result) => typeof result === "undefined");

          if (success) {
            return handleEffect(onSuccess(values), wasEditing);
          }

          if (focusOnFirstError) {
            focusFirstError(names, results);
          }

          names.forEach((name, index) => {
            errors[name] = results[index];
          });

          return handleEffect(onFailure(errors), wasEditing);
        })
        .finally(() => {
          formStatus.current = "submitted";

          if (mounted.current) {
            forceUpdate();
          }
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
    states.current = {} as (typeof states)["current"];

    for (const name in config.current) {
      if (Object.prototype.hasOwnProperty.call(config.current, name)) {
        states.current[name] = {
          callbacks: new Set(),
          ref: { current: null },
          mounted: false,
          timeout: undefined,
          exposed: {
            value: config.current[name].initialValue,
            talkative: false,
            validity: { tag: "unknown" },
          },
        };
      }
    }

    const Field: Contract["Field"] = ({ name, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => states.current[name].exposed,
          subscribe: (callback: () => void): (() => void) => {
            states.current[name].callbacks.add(callback);

            return () => {
              states.current[name].callbacks.delete(callback);
            };
          },
        }),
        [name],
      );

      useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      useEffect(() => {
        const isFirstMounting = !states.current[name].mounted;

        if (isFirstMounting) {
          states.current[name].mounted = true;
        } else {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "Mounting multiple fields with identical names is not supported and will lead to errors",
            );
          }
        }

        return () => {
          if (isFirstMounting) {
            states.current[name].mounted = false;
          }
        };
      }, [name]);

      return children({
        ...api.getFieldState(name),
        ref: states.current[name].ref,
        onBlur: useMemo(() => api.getOnBlur(name), [name]),
        onChange: useMemo(() => api.getOnChange(name), [name]),
      });
    };

    Field.displayName = "Field";
    field.current = Field;

    const FieldsListener: Contract["FieldsListener"] = ({ names, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => JSON.stringify(names.map((name) => states.current[name].exposed)),
          subscribe: (callback: () => void): (() => void) => {
            names.forEach((name) => states.current[name].callbacks.add(callback));

            return () => {
              names.forEach((name) => states.current[name].callbacks.delete(callback));
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
