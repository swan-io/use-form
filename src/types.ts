import { Future, Option } from "@swan-io/boxed";
import { MutableRefObject, ReactElement } from "react";

export type AnyRecord = Record<string, unknown>;
export type EmptyRecord = Record<PropertyKey, never>;

export type OptionalRecord<T extends AnyRecord> = {
  [K in keyof T]: Option<T[K]>;
};

export type ValidatorResult<ErrorMessage = string> = ErrorMessage | void;

export type Validator<Value, ErrorMessage = string> = (
  value: Value,
) => ValidatorResult<ErrorMessage>;

export type Validity<ErrorMessage = string> =
  | { readonly tag: "unknown" }
  | { readonly tag: "valid" }
  | { readonly tag: "invalid"; error: ErrorMessage };

export type FormStatus = "untouched" | "editing" | "submitting" | "submitted";

// Kudos to https://github.com/MinimaHQ/re-formality/blob/master/docs/02-ValidationStrategies.md
export type Strategy = "onChange" | "onSuccess" | "onBlur" | "onSuccessOrBlur" | "onSubmit";

export type FieldState<Value, ErrorMessage = string> = {
  value: Value;
  valid: boolean;
  error: ErrorMessage | undefined;
};

export type FormConfig<Values extends AnyRecord, ErrorMessage = string> = {
  [N in keyof Values]: {
    initialValue: Values[N];
    strategy?: Strategy;
    isEqual?: (value1: Values[N], value2: Values[N]) => boolean;
    sanitize?: (value: Values[N]) => Values[N];
    validate?: (
      value: Values[N],
      helpers: {
        focusField: (name: keyof Values) => void;
        getFieldValue: <N extends keyof Values>(
          name: N,
          options?: { sanitize?: boolean },
        ) => Values[N];
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

  getFieldValue: <N extends keyof Values>(name: N, options?: { sanitize?: boolean }) => Values[N];
  setFieldValue: <N extends keyof Values>(
    name: N,
    value: Values[N],
    options?: { validate?: boolean },
  ) => void;
  setFieldError: (name: keyof Values, error?: ErrorMessage) => void;

  focusField: (name: keyof Values) => void;
  resetField: (name: keyof Values) => void;
  sanitizeField: (name: keyof Values) => void;
  validateField: (name: keyof Values) => ValidatorResult<ErrorMessage>;

  listenFields: <N extends keyof Values>(
    names: N[],
    listener: (states: {
      [N1 in N]: FieldState<Values[N1], ErrorMessage>;
    }) => void,
  ) => () => void;

  resetForm: () => void;
  submitForm: (options?: {
    onSuccess?: (values: OptionalRecord<Values>) => Future<unknown> | Promise<unknown> | void;
    onFailure?: (errors: Partial<Record<keyof Values, ErrorMessage>>) => void;
    focusOnFirstError?: boolean;
  }) => void;
};
