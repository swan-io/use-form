# react-ux-form

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/swan-io/react-ux-form/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-ux-form?style=for-the-badge)](https://www.npmjs.org/package/react-ux-form)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-ux-form?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=react-ux-form)

A simple, fast, and opinionated form library for React & React Native focusing on UX.<br>
👉 Take a look at [the demo website](https://swan-io.github.io/react-ux-form).

## Setup

```bash
$ npm install --save react-ux-form
# --- or ---
$ yarn add react-ux-form
```

## Features

- Subscription-based field updates (avoid re-render the whole form on each keystroke 🔥)
- Validation strategies ✨
- Field sanitization
- Mounted-only fields validation
- Advanced focus handling
- Best-in-class TypeScript support
- Sync and async field validation
- Sync and async form submission

## Motivation

Why another React form library 🤔?<br>
Because, as silly as it seems, we couldn't find any existing library which fits our existing needs:

- We want validation strategies per field because we fell in love with them when we read the [re-formality](https://github.com/MinimaHQ/re-formality) documentation (which is unfortunately only available for [ReScript](https://rescript-lang.org/)).
- It should be able to handle huge forms without a single performance hiccup.
- Validation should be simple, reusable, and testable (aka just functions).
- It shouldn't even try to validate unmounted fields.
- It should have built-in focus management (to improve the keyboard flow of our React Native forms).

## Validation strategies ✨

The key of **good UX** is simple: validation should be executed **in continue**, feedback should be provided **when it makes sense**.

### Quick example: A credit card field 💳

Let's say we want to display a valid state icon (✔) when the input value is a valid credit card number but don't want to display an error until the user blurs the field (and lets the value in an invalid state).

#### Something like this:

![Valid credit card](docs/credit-card-valid.gif)
![Invalid credit card](docs/credit-card-error.gif)

How do we easily achieve such magic? With the `onSuccessOrBlur` strategy 🧙‍♂️<br>

```tsx
const {} = useForm({
  cardNumber: { initialValue: "", strategy: "onSuccessOrBlur" },
});
```

Of course, `onSuccessOrBlur` will not fit perfectly every use-case!<br>
That's precisely why every field config could declare its own `strategy`:

| Strategy          | When feedback will be available?                              |
| ----------------- | ------------------------------------------------------------- |
| `onChange`        | On first change (as the user types or update the value)       |
| `onSuccess`       | On first validation success                                   |
| `onBlur`          | On first field blur                                           |
| `onSuccessOrBlur` | On first validation success or first field blur **(default)** |
| `onSubmit`        | On form submit                                                |

#### Note that:

- The strategies will only be activated after the field value update / the form submission.
- Once the first feedback is given (the field is `valid` or should display an `error` message), the field switches to what we call _"talkative"_ state. After that, feedback will be updated on each value change until this field or the form is reset.

## API

⚠️ The API is described using TypeScript pseudocode.<br>These types are not exported by the library / are not even always valid.

### useForm

`useForm` takes one argument (a map of your fields configs) and returns a set of helpers (functions, components, and values) to manage your form state.

```tsx
import { useForm } from "react-ux-form";

const {
  formStatus,
  Field,
  FieldsListener,
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
} = useForm({
  // Keys are used as fields names
  fieldName: {
    initialValue: "",
    // Properties below are optional (those are the default values)
    strategy: "onSuccessOrBlur",
    debounceInterval: 0,
    equalityFn: (value1, value2) => Object.is(value1, value2),
    sanitize: (value) => value,
    validate: (value, { focusField, getFieldState }) => {},
  },
});
```

#### Field config

```tsx
type fieldConfig = {
  // The initial field value. It could be anything (string, number, boolean…)
  initialValue: Value;

  // The chosen strategy. See "validation strategies" paragraph
  strategy: Strategy;

  // An amount of time (in ms) to wait before triggering validation
  debounceInterval: number;

  // When performing async validation, it might happen that the value has changed between the start and the end of its execution
  // That's why we compare the two values: to ensure that the feedback given to the user is correct
  equalityFn: (value1: Value, value2: Value) => boolean;

  // Will be run on value before validation and submission. Useful from trimming whitespaces
  sanitize: (value: Value) => Value;

  // Used to perform field validation. It could return an error message (or nothing)
  // It also handle async: simply return a Promise that resolves with an error message (or nothing)
  validate: (value: Value) => ErrorMessage | void | Promise<ErrorMessage | void>;
};
```

#### formStatus

```tsx
type formStatus =
  | "untouched" // no field has been updated
  | "editing"
  | "submitting"
  | "submitted";
```

#### `<Field />`

A component that exposes everything you need locally as a `children` render prop.

```tsx
<Field name="fieldName">
  {
    (props: {
      // A ref to pass to your element (only required for focus handling)
      ref: MutableRefObject;
      // The field value
      value: Value;
      // Is the field validating? (only happen on async operations)
      validating: boolean;
      // Is the field valid?
      valid: boolean;
      // The field is invalid: here its error message.
      error?: ErrorMessage;
      // The onBlur handler (required for onBlur and onSuccessOrBlur strategies)
      onBlur: () => void;
      // The onChange handler (required)
      onChange: (value: Value) => void;
      // Focus the next field (uses the field config declaration order in useForm)
      focusNextField: () => void;
    }) => /* … */
  }
</Field>
```

#### `<FieldsListener />`

A component that listens for fields states changes. It's useful when a part of your component needs to react to fields updates without triggering a full re-render.

```tsx
<FieldsListener names={["firstName", "lastName"]}>
  {
    (states: Record<"firstName" | "lastName", {
      // The field value
      value: Value;
      // Is the field validating? (only happen on async operations)
      validating: boolean;
      // Is the field valid?
      valid: boolean;
      // The field is invalid: here its error message.
      error?: ErrorMessage;
    }>) => /* … */
  }
</FieldsListener>
```

#### getFieldState

By setting `sanitize: true`, you will enforce sanitization.

```tsx
type getFieldState = (
  name: FieldName,
  options?: {
    sanitize?: boolean;
  },
) => {
  value: Value;
  validating: boolean;
  valid: boolean;
  error?: ErrorMessage;
};
```

#### setFieldValue

By setting `validate: true`, you will enforce validation. It has no effect if the field is already _talkative_.

```tsx
type setFieldValue = (
  name: FieldName,
  value: Value,
  options?: {
    validate?: boolean;
  },
) => void;
```

#### setFieldError

Will make the field _talkative_.

```tsx
type setFieldError = (name: FieldName, error?: ErrorMessage) => void;
```

#### focusField

Will only work if you forward the `Field` provided `ref` to your input.

```tsx
type focusField = (name: FieldName) => void;
```

#### resetField

Hide user feedback (the field is not _talkative_ anymore). If `feedbackOnly` is not set to `true`, value will also be resetted to `initialValue`.

```tsx
type resetField = (
  name: FieldName,
  options?: {
    feedbackOnly?: boolean;
  },
) => void;
```

#### sanitizeField

Sanitize the field value.

```tsx
type sanitizeField = (name: FieldName) => void;
```

#### validateField

Once you manually call validation, the field automatically switches to _talkative_ state.

```tsx
type validateField = (name: FieldName) => Promise<ErrorMessage | void>;
```

#### listenFields

A function that listen for fields states changes. Useful when you want to apply side effects on values change.

```tsx
React.useEffect(() => {
  const removeListener = listenFields(
    ["firstName", "lastName"],
    (states: Record<"firstName" | "lastName", {
      // The field value
      value: Value;
      // Is the field validating? (only happen on async operations)
      validating: boolean;
      // Is the field valid?
      valid: boolean;
      // The field is invalid: here its error message.
      error?: ErrorMessage;
    }>) => /* … */
  );

  return () => {
    removeListener();
  }
}, []);
```

#### resetForm

Hide user feedback for all fields (they are not _talkative_ anymore). If `feedbackOnly` is not set to `true`, values will also be resetted to their corresponding `initialValue` and `formStatus` will be resetted to `untouched`.

```tsx
type resetForm = (options?: { feedbackOnly?: boolean }) => void;
```

#### submitForm

Submit your form. Each callback could return a `Promise` to keep `formStatus` in `submitting` state.

```tsx
type submitForm = (
  onSuccess: (values: Partial<Values>) => Promise<unknown> | void,
  onFailure?: (errors: Partial<ErrorMessages>) => Promise<unknown> | void,
  options?: {
    // by default, it will try to focus the first errored field (which is a good practice)
    avoidFocusOnError?: boolean;
  },
) => void;
```

### combineValidators

As it's a very common case to use several validation functions per field, we export a `combineValidators` helper function that allows you to chain sync and async validation functions: it will run them sequentially until an error is returned.

```tsx
import { combineValidators, useForm } from "react-ux-form";

const validateRequired = (value: string) => {
  if (!value) {
    return "required";
  }
};

const validateEmail = (email: string) => {
  if (!/.+@.+\..{2,}/.test(email)) {
    return "invalid email";
  }
};

const MyAwesomeForm = () => {
  const { Field, submitForm } = useForm({
    emailAddress: {
      initialValue: "",
      // will run each validation function until an error is returned
      validate: combineValidators(
        isEmailRequired && validateRequired, // validation checks could be applied conditionally
        validateEmail,
      ),
    },
  });

  // …
};
```

### toOptionalValidator

Very often, we want to execute validation only if a value is set. By wrapping any validator (or combined validators) with `toOptionalValidator`, you can bypass the validation if the value is empty.

```tsx
import { toOptionalValidator, Validator } from "react-ux-form";

// This validator will error if the string length is < 3 (even if it's an empty string)
const validator: Validator<string> = (value) => {
  if (value.length < 3) {
    return "Must be at least 3 characters";
  }
};

// This validator will error if value is not empty string and if the string length is < 3
const optionalValidator = toOptionalValidator(validator);
```

This function also accept a second param (required for non-string validators) to specify what is the empty value.

```tsx
import { toOptionalValidator, Validator } from "react-ux-form";

const validator: Validator<number> = (value) => {
  if (value < 10) {
    return "Must pick at least 10 items";
  }
};

// This validator will also accept a value of 0, as we consider it "empty"
const optionalValidator = toOptionalValidator(validator, 0);
```

### hasDefinedKeys

As some of your fields might be unmounted on submit, the `submitForm` method could not guarantee that every field value is defined and valid. We export `hasDefinedKeys` helper function that allows you to test if some object keys are defined.

```tsx
import { hasDefinedKeys, useForm } from "react-ux-form";

const MyAwesomeForm = () => {
  const { Field, submitForm } = useForm({
    firstName: { initialValue: "" },
    lastName: { initialValue: "" },
  });

  const handleSubmit = () => {
    submitForm((values) => {
      if (hasDefinedKeys(values, ["firstName", "lastName"])) {
        // values.firstName and values.lastName are defined (the fields are mounted)
      }
    });
  };

  // …
};
```

## Quickstart

```tsx
import { useForm } from "react-ux-form";

const MyAwesomeForm = () => {
  const { Field, submitForm } = useForm({
    firstName: {
      initialValue: "",
      strategy: "onSuccessOrBlur",
      sanitize: (value) => value.trim(), // we trim value before validation and submission
      validate: (value) => {
        if (value === "") {
          return "First name is required";
        }
      },
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();

        submitForm(
          (values) => console.log("values", values), // all fields are valid
          (errors) => console.log("errors", errors), // at least one field is invalid
        );
      }}
    >
      <Field name="firstName">
        {({ error, onBlur, onChange, valid, value }) => (
          <>
            <label htmlFor="firstName">First name</label>

            <input
              id="firstName"
              onBlur={onBlur}
              value={value}
              onChange={({ target }) => {
                onChange(target.value);
              }}
            />

            {valid && <span>Valid</span>}
            {error && <span>Invalid</span>}
          </>
        )}
      </Field>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## More examples

A full set of examples is available on [the demo website](https://swan-io.github.io/react-ux-form) or in the [`/website` directory](https://github.com/swan-io/react-ux-form/tree/main/website) project. Just clone the repository, install its dependencies and start it!

## Acknowledgements

- [re-formality](https://github.com/MinimaHQ/re-formality) for the [validation strategies](https://github.com/MinimaHQ/re-formality/blob/master/docs/02-ValidationStrategies.md) idea.
- [react-hook-form](https://react-hook-form.com/) and [react-final-form](https://github.com/final-form/react-final-form) for their subscription pattern implementations.
