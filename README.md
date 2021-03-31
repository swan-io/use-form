# react-ux-form

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/swan-io/react-ux-form/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-ux-form?style=for-the-badge)](https://www.npmjs.org/package/react-ux-form)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/react-ux-form?label=size&style=for-the-badge)](https://bundlephobia.com/result?p=react-ux-form)

A simple, performant and opinionated form library for React & React Native.

## Setup

```bash
$ npm install --save react-ux-form
# --- or ---
$ yarn add react-ux-form
```

## Features

- Subscription based field updates (avoid rerendering the whole form on each keystroke 🔥)
- Validation strategies ✨
- Field sanitization
- Mounted-only fields validation
- Advanced focus handling
- Best-in-class TypeScript support
- Sync and async field validation
- Sync and async form submission

## Motivation

Why another React form library 🤔?<br>
Because, as silly as it seems, we didn't found any existing library which fits our existing needs:

- We want validation strategies per field, because we fell in love with them when we read the [re-formality](https://github.com/MinimaHQ/re-formality) documentation (which is unfortunately only available for [ReScript](https://rescript-lang.org/)).
- It should be able to handle huge forms without a single performance hiccup.
- Validation should be simple, reusable and testable (aka just functions).
- It shouldn't even try to validate unmounted fields.
- It should have some sort of built-in focus management (to improve the keyboard flow of our React Native forms).

## ✨ Validation strategies

The key of **good UX** is simple: validation should be executed **in continue**, feedback should be provided **when it makes sense**.

### Quick example: 💳 A credit card field

Let's say we want to display some sort of valid state icon (✔) when the input value is a valid credit card number but don't want to display an error until the user blur the field (and let the value in an invalid state).

#### Something like this:

![Valid credit card](docs/credit-card-valid.gif)
![Invalid credit card](docs/credit-card-error.gif)

How do we easily achieve such magic? With the `onFirstSuccessOrFirstBlur` strategy 🧙‍♂️<br>

```tsx
const {} = useForm({
  cardNumber: { initialValue: "", strategy: "onFirstSuccessOrFirstBlur" },
});
```

Of course, `onFirstSuccessOrFirstBlur` will not fit perfectly every use-case!<br>
That's precisely why every field config could declare its own `strategy`:

| Strategy                    | When feedback will be available?                              |
| --------------------------- | ------------------------------------------------------------- |
| `onFirstChange`             | On first change (as the user types or update the value)       |
| `onFirstSuccess`            | On first validation success                                   |
| `onFirstBlur`               | On first field blur                                           |
| `onFirstSuccessOrFirstBlur` | On first validation success or first field blur **(default)** |
| `onSubmit`                  | On form submit                                                |

👉 Note that once the first feedback is given (the field is `valid` or should display an `error` message), the field switches to what we call _"talkative"_ state.<br>
After that, feedback will be updated on each value change until this field or the form is reset.

## API

⚠️ The API are described using TypeScript pseudocode. These types does not necessarily exists / are not always valid.

### useForm()

`useForm` takes one argument (a map of your fields configs) and returns a set of helpers (functions, components and values) to manage your form state.

```tsx
const {
  formStatus,
  Field,
  getFieldState,
  setFieldValue,
  focusField,
  resetField,
  validateField,
  resetForm,
  submitForm,
} = useForm({
  fieldName: { // Keys are used as fields names
    initialValue: "",
    // Properties below are optional (those are the default values)
    strategy: "onFirstSuccessOrFirstBlur",
    debounceInterval: 0,
    equalityFn: (value1: string, value2: string) => Object.is(value1, value2),
    sanitize: (value) => value,
    validate: (value, { focusField, getFieldState }) => {},
  },
});
```

### Field config

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

### formStatus

```tsx
type formStatus =
  | "untouched" // no field has been updated
  | "editing"
  | "submitting"
  | "submitted";
```

### getFieldState

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

### setFieldValue

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

### focusField

Will only works if you forward the `Field` provided `ref` to your input.

```tsx
type focusField = (name: FieldName) => void;
```

### resetField

Value will be set to `initialValue` and user feedback will be hidden (the field is not _talkative_ anymore).

```tsx
type resetField = (name: FieldName) => void;
```

### validateField

Once you manually call validation, the switch automatically switch to _talkative_ state.

```tsx
type validateField = (name: FieldName) => Promise<ErrorMessage | void>;
```

### resetForm

Will reset all fields states and the `formStatus`.

```tsx
type resetForm = () => void;
```

### submitForm

Submit your form. Each callback could return a `Promise` to keep `formStatus` in `submitting` state.

```tsx
type submitForm = (
  onSuccess: (values: Partial<Values>) => Promise<void> | void,
  onFailure?: (errors: Partial<ErrorMessages>) => Promise<void> | void,
) => void;
```

### <Field />

TODO

## Quickstart

```tsx
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";

export const BasicForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    // Define form fields
    emailAddress: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(), // trim value before validation and submit
      validate: (value) => { // validation function
        if (!validator.isEmail(value)) {
          return "A valid email is required";
        }
      },
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitForm(
      (values) => { // called if all fields are valid
        console.log("values", values);
      },
      (errors) => { // called if at least 1 field is invalid
        console.log("errors", errors);
      },
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Field name="emailAddress">
        {({ error, onBlur, onChange, ref, valid, validating, value }) => (
          <>
            <label>Email address</label>

            <input
              ref={ref}
              value={value}
              onBlur={onBlur}
              onChange={(e) => onChange(e.currentTarget.value)}
            />

            {valid && <span>Valid</span>}
            {validating && <span>Validating...</span>}
            {error && <span>Invalid</span>}
          </>
        )}
      </Field>

      <div>
        <button type="button" onClick={resetForm}>
          Reset
        </button>

        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
```

# Acknowledgements

- [re-formality](https://github.com/MinimaHQ/re-formality) for the [validation strategies](https://github.com/MinimaHQ/re-formality/blob/master/docs/02-ValidationStrategies.md) idea.
- [react-jeff](https://github.com/jamiebuilds/react-jeff) for its simple and testable validation API.
- [react-hook-form](https://react-hook-form.com/) and [react-final-form](https://github.com/final-form/react-final-form) for their subscription pattern implementations.
