import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { useForm } from "../src";

afterEach(cleanup);

test("formStatus evolve though time", async () => {
  const Test = () => {
    const { Field, formStatus, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onFirstSuccess",
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
                id="firstName"
                onBlur={onBlur}
                type="text"
                value={value}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {valid && <div>valid</div>}
              {validating && <div>validating</div>}
              {error && <div>error</div>}
            </>
          )}
        </Field>

        <div>formStatus: {formStatus}</div>

        <button onClick={(e) => resetForm()}>Reset</button>
        <button onClick={(e) => submitForm((values) => {})}>Submit</button>
      </form>
    );
  };

  const { findByLabelText, findByText } = render(<Test />);
  await findByText("formStatus: untouched");

  const input = await findByLabelText("First name");
  const submitButton = await findByText("Submit");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("formStatus: editing");
  fireEvent.click(submitButton);

  const resetButton = await findByText("Reset");

  await findByText("formStatus: submitted");
  fireEvent.click(resetButton);

  await findByText("formStatus: untouched");
});
