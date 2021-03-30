import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { useForm } from "../src";
import { resolveAfter } from "./utils/promises";

test("input validation evolve though time", async () => {
  const Test = () => {
    const { Field, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onFirstBlur",
        initialValue: "",
        validate: (value) => {
          if (value.length < 3) {
            return "Must be at least 3 characters";
          }
        },
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="firstName">
          {({ ref, error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
                ref={ref}
                type="text"
                id="firstName"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>idle</div>}
              {valid && <div>valid</div>}
              {validating && <div>validating</div>}
              {error && <div>error</div>}
            </>
          )}
        </Field>

        <button onClick={(e) => resetForm()}>Reset</button>
        <button onClick={(e) => submitForm((values) => {})}>Submit</button>
      </form>
    );
  };

  const { findByLabelText, findByText } = render(<Test />);

  const input = await findByLabelText("First name");

  fireEvent.focus(input);
  fireEvent.blur(input);

  await findByText("error");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("valid");
});

test("input validation evolve though time with async validation", async () => {
  const Test = () => {
    const { Field, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onFirstBlur",
        initialValue: "",
        validate: (value) =>
          resolveAfter(100, value.length < 3 ? "Must be at least 3 characters" : undefined),
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="firstName">
          {({ ref, error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
                ref={ref}
                type="text"
                id="firstName"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>idle</div>}
              {valid && <div>valid</div>}
              {validating && <div>validating</div>}
              {error && <div>error</div>}
            </>
          )}
        </Field>

        <button onClick={(e) => resetForm()}>Reset</button>
        <button onClick={(e) => submitForm((values) => {})}>Submit</button>
      </form>
    );
  };

  const { findByLabelText, findByText } = render(<Test />);

  const input = await findByLabelText("First name");

  fireEvent.focus(input);
  fireEvent.blur(input);

  await findByText("validating");
  await findByText("error");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("validating");
  await findByText("valid");
});
