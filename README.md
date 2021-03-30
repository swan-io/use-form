# react-ux-form

## Installation

```sh
# with yarn
yarn add react-ux-form
# or with npm
npm install --save react-ux-form
```

## Basic example

```tsx
import * as React from "react";
import validator from "validator";
import { useForm } from "../../../src";

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
