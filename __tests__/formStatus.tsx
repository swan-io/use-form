import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { useForm } from "../src";
import { resolveAfter } from "./utils/promises";

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
                type="text"
                id="firstName"
                value={value}
                onBlur={onBlur}
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

  const input = await findByLabelText("First name");
  const resetButton = await findByText("Reset");
  const submitButton = await findByText("Submit");

  await findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await findByText("formStatus: untouched");
});

test("formStatus evolve though time with async validation", async () => {
  const Test = () => {
    const { Field, formStatus, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onFirstSuccess",
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

  const input = await findByLabelText("First name");
  const resetButton = await findByText("Reset");
  const submitButton = await findByText("Submit");

  await findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await findByText("formStatus: submitting");
  await findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await findByText("formStatus: untouched");
});

test("formStatus evolve though time with async submission", async () => {
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
                type="text"
                id="firstName"
                value={value}
                onBlur={onBlur}
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
        <button onClick={(e) => submitForm((values) => resolveAfter(100))}>Submit</button>
      </form>
    );
  };

  const { findByLabelText, findByText } = render(<Test />);

  const input = await findByLabelText("First name");
  const resetButton = await findByText("Reset");
  const submitButton = await findByText("Submit");

  await findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await findByText("formStatus: submitting");
  await findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await findByText("formStatus: untouched");
});
