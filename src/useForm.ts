import { Option } from "@swan-io/boxed";
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
import { identity, isPromise, noop } from "./helpers";
import {
  AnyRecord,
  FieldState,
  Form,
  FormConfig,
  FormStatus,
  OptionalRecord,
  Strategy,
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

  type StateMap = {
    [N in Name]: Readonly<{
      exposed: FieldState<Values[N], ErrorMessage>;
      talkative: boolean;
      validity: Validity<ErrorMessage>;
    }>;
  };

  const states = useRef() as MutableRefObject<StateMap>;

  type CallbackMap = Record<Name, Set<() => void>>;
  type MountedMap = Record<Name, boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type RefMap = Record<Name, MutableRefObject<any>>;

  const callbacks = useRef() as MutableRefObject<CallbackMap>;
  const mounteds = useRef() as MutableRefObject<MountedMap>;
  const refs = useRef() as MutableRefObject<RefMap>;

  const field = useRef() as MutableRefObject<Contract["Field"]>;
  const fieldsListener = useRef() as MutableRefObject<Contract["FieldsListener"]>;

  const api = useMemo(() => {
    const getInitialValue = (name: Name) => config.current[name].initialValue;
    const getSanitize = (name: Name) => config.current[name].sanitize ?? identity;
    const getStrategy = (name: Name) => config.current[name].strategy ?? "onSuccessOrBlur";
    const getValidate = (name: Name) => config.current[name].validate ?? noop;

    const isMounted = (name: Name) => mounteds.current[name];

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
              valid: false,
              error: undefined,
            }
          : {
              valid: nextState.validity.tag === "valid",
              error: nextState.validity.tag === "invalid" ? nextState.validity.error : undefined,
            };

      states.current[name] = {
        talkative: nextState.talkative,
        validity: nextState.validity,
        exposed: { ...exposed, value: nextState.value },
      };
    };

    const setInitialState = <N extends Name>(name: N) => {
      setState(name, {
        value: getInitialValue(name),
        talkative: false,
        validity: { tag: "unknown" },
      });
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
      const sanitize = getSanitize(name);
      const validate = getValidate(name);
      const value = sanitize(states.current[name].exposed.value);
      const error = validate(value, { getFieldState, focusField });

      if (error === undefined) {
        setTalkative(name, ["onSuccess", "onSuccessOrBlur"]);
      }

      setError(name, error);
      runRenderCallbacks(name);

      return error;
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
      setInitialState(name);
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
        return undefined;
      }

      setTalkative(name);
      return internalValidateField(name);
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
        setState(name, (prevState) => ({
          ...prevState,
          value,
        }));

        setTalkative(name, ["onChange"]);

        if (formStatus.current === "untouched" || formStatus.current === "submitted") {
          formStatus.current = "editing";
          forceUpdate();
        }

        void internalValidateField(name);
      };

    const getOnBlur = (name: Name) => (): void => {
      setTalkative(name, ["onBlur", "onSuccessOrBlur"]);
      void internalValidateField(name);
    };

    const resetForm: Contract["resetForm"] = () => {
      Object.keys(config.current).forEach((name) => resetField(name));
      formStatus.current = "untouched";

      forceUpdate();
    };

    const focusFirstError = (names: Name[], results: ValidatorResult<ErrorMessage>[]) => {
      const index = results.findIndex((result) => typeof result !== "undefined");
      const name = names[index];

      if (typeof name !== "undefined") {
        focusField(name);
      }
    };

    const isSuccessfulSubmission = (
      results: ValidatorResult<ErrorMessage>[],
    ): results is undefined[] => results.every((result) => typeof result === "undefined");

    const submitForm: Contract["submitForm"] = ({
      onSuccess = noop,
      onFailure = noop,
      focusOnFirstError = true,
    } = {}) => {
      if (formStatus.current === "submitting") {
        return; // Avoid concurrent submissions
      }

      formStatus.current = "submitting";

      const keys: Name[] = Object.keys(mounteds.current);
      const names = keys.filter((name) => mounteds.current[name]);
      const values = {} as OptionalRecord<Values>;
      const errors: Partial<Record<Name, ErrorMessage>> = {};
      const results: ValidatorResult<ErrorMessage>[] = [];

      keys.forEach((name) => {
        values[name] = Option.None();
      });

      names.forEach((name: Name, index) => {
        setTalkative(name);
        values[name] = Option.Some(getFieldState(name, { sanitize: true }).value);
        results[index] = internalValidateField(name);
      });

      if (isSuccessfulSubmission(results)) {
        const effect = onSuccess(values);

        if (!isPromise(effect)) {
          formStatus.current = "submitted";
          return forceUpdate();
        }

        forceUpdate();

        void effect.finally(() => {
          formStatus.current = "submitted";

          if (mounted.current) {
            forceUpdate();
          }
        });
      } else {
        if (focusOnFirstError) {
          focusFirstError(names, results);
        }

        names.forEach((name, index) => {
          errors[name] = results[index] as ErrorMessage | undefined;
        });

        onFailure(errors);

        formStatus.current = "submitted";
        forceUpdate();
      }
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

      getOnChange,
      getOnBlur,
      setInitialState,
      setState,
    };
  }, []);

  // Lazy initialization
  if (!states.current) {
    states.current = {} as StateMap;

    callbacks.current = {} as CallbackMap;
    mounteds.current = {} as MountedMap;
    refs.current = {} as RefMap;

    for (const name in config.current) {
      if (Object.prototype.hasOwnProperty.call(config.current, name)) {
        api.setInitialState(name);

        callbacks.current[name] = new Set();
        mounteds.current[name] = false;
        refs.current[name] = { current: null };
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
