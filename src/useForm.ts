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
  config: FormConfig<Values, ErrorMessage>,
): Form<Values, ErrorMessage> => {
  type Contract = Form<Values, ErrorMessage>;
  type Name = keyof Values;

  const [, forceUpdate] = useReducer(() => [], []);
  const mounted = useRef(false);
  const arg = useRef(config);
  const formStatus = useRef<FormStatus>("untouched");

  useIsoLayoutEffect(() => {
    arg.current = config;
  });

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const fields = useRef() as MutableRefObject<{
    [N in Name]: {
      readonly callbacks: Set<() => void>;
      readonly ref: MutableRefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
      mounted: boolean;
      state: Readonly<{
        talkative: boolean;
        value: Values[N];
        validity: Validity<ErrorMessage>;
      }>;
    };
  }>;

  const field = useRef() as MutableRefObject<Contract["Field"]>;
  const fieldsListener = useRef() as MutableRefObject<Contract["FieldsListener"]>;

  const api = useMemo(() => {
    const getInitialValue = (name: Name) => arg.current[name].initialValue;
    const getSanitize = <N extends Name>(name: N) => arg.current[name].sanitize ?? identity;
    const getStrategy = (name: Name) => arg.current[name].strategy ?? "onSuccessOrBlur";
    const getValidate = (name: Name) => arg.current[name].validate ?? noop;

    const isMounted = (name: Name) => fields.current[name].mounted;
    const isTalkative = (name: Name) => fields.current[name].state.talkative;

    const setState = <N extends Name>(
      name: N,
      state: SetStateAction<{
        value: Values[N];
        talkative: boolean;
        validity: Validity<ErrorMessage>;
      }>,
    ) => {
      fields.current[name].state =
        typeof state === "function" ? state(fields.current[name].state) : state;
    };

    const getFieldState = <N extends Name>(
      name: N,
      options: { sanitize?: boolean } = {},
    ): FieldState<Values[N], ErrorMessage> => {
      const { sanitize = false } = options;
      const { state } = fields.current[name];
      const value = sanitize ? getSanitize(name)(state.value) : state.value;

      return !state.talkative || state.validity.tag === "unknown"
        ? // Avoid giving feedback too soon
          {
            value,
            valid: getValidate(name) === noop,
            error: undefined,
          }
        : {
            value,
            valid: state.validity.tag === "valid",
            error: state.validity.tag === "invalid" ? state.validity.error : undefined,
          };
    };

    const runRenderCallbacks = (name: Name): void => {
      fields.current[name].callbacks.forEach((callback) => callback());
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

    const focusField: Contract["focusField"] = (name) => {
      const { ref } = fields.current[name];

      if (ref.current && typeof ref.current.focus === "function") {
        ref.current.focus();
      }
    };

    const internalValidateField = <N extends Name>(name: N): ValidatorResult<ErrorMessage> => {
      const sanitize = getSanitize(name);
      const validate = getValidate(name);

      const value = sanitize(getFieldState(name).value);
      const error = validate(value, { getFieldState, focusField });

      if (error === undefined) {
        setTalkative(name, ["onSuccess", "onSuccessOrBlur"]);
      }

      setError(name, error);
      runRenderCallbacks(name);

      return error;
    };

    const setFieldValue: Contract["setFieldValue"] = (name, value, options = {}) => {
      const { validate = false } = options;

      setState(name, (prevState) => ({
        ...prevState,
        value,
      }));

      if (validate) {
        setTalkative(name);
      }

      void internalValidateField(name);
    };

    const setFieldError: Contract["setFieldError"] = (name, error) => {
      setError(name, error);
      setTalkative(name);
      runRenderCallbacks(name);
    };

    const resetField: Contract["resetField"] = (name) => {
      setState(name, {
        value: getInitialValue(name),
        talkative: false,
        validity: { tag: "unknown" },
      });

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

      names.forEach((name) => fields.current[name].callbacks.add(callback));

      return () => {
        names.forEach((name) => fields.current[name].callbacks.delete(callback));
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
      const { validity } = fields.current[name].state;

      // Avoid validating an untouched / already valid field
      if (validity.tag !== "unknown" && !isTalkative(name)) {
        setTalkative(name, ["onBlur", "onSuccessOrBlur"]);
        void internalValidateField(name);
      }
    };

    const resetForm: Contract["resetForm"] = () => {
      Object.keys(arg.current).forEach((name) => resetField(name));
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

      const keys: Name[] = Object.keys(fields.current);
      const names = keys.filter((name) => fields.current[name].mounted);
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
    };
  }, []);

  // Lazy initialization
  if (!fields.current) {
    fields.current = {} as (typeof fields)["current"];

    for (const name in arg.current) {
      if (Object.prototype.hasOwnProperty.call(arg.current, name)) {
        fields.current[name] = {
          callbacks: new Set(),
          ref: { current: null },
          mounted: false,
          state: {
            value: arg.current[name].initialValue,
            talkative: false,
            validity: { tag: "unknown" },
          },
        };
      }
    }

    const Field: Contract["Field"] = ({ name, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => fields.current[name].state,
          subscribe: (callback: () => void): (() => void) => {
            fields.current[name].callbacks.add(callback);

            return () => {
              fields.current[name].callbacks.delete(callback);
            };
          },
        }),
        [name],
      );

      useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      useEffect(() => {
        const isFirstMounting = !fields.current[name].mounted;

        if (isFirstMounting) {
          fields.current[name].mounted = true;
        } else {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "Mounting multiple fields with identical names is not supported and will lead to errors",
            );
          }
        }

        return () => {
          if (isFirstMounting) {
            fields.current[name].mounted = false;
          }
        };
      }, [name]);

      return children({
        ...api.getFieldState(name),
        ref: fields.current[name].ref,
        onBlur: useMemo(() => api.getOnBlur(name), [name]),
        onChange: useMemo(() => api.getOnChange(name), [name]),
      });
    };

    Field.displayName = "Field";
    field.current = Field;

    const FieldsListener: Contract["FieldsListener"] = ({ names, children }) => {
      const { subscribe, getSnapshot } = useMemo(
        () => ({
          getSnapshot: () => JSON.stringify(names.map((name) => fields.current[name].state)),
          subscribe: (callback: () => void): (() => void) => {
            names.forEach((name) => fields.current[name].callbacks.add(callback));

            return () => {
              names.forEach((name) => fields.current[name].callbacks.delete(callback));
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
