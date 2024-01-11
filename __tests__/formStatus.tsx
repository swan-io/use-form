import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { test } from "vitest";
import { useForm } from "../src";
import { resolveAfter } from "./utils/promises";

test("formStatus evolve though time", async () => {
  const Test = () => {
    const { Field, formStatus, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onSuccess",
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
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
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

        <div>formStatus: {formStatus}</div>

        <button onClick={() => resetForm()}>Reset</button>
        <button onClick={() => submitForm()}>Submit</button>
      </form>
    );
  };

  render(<Test />);

  const input = await screen.findByLabelText("First name");
  const resetButton = await screen.findByText("Reset");
  const submitButton = await screen.findByText("Submit");

  await screen.findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await screen.findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await screen.findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await screen.findByText("formStatus: untouched");
});

test("formStatus evolve though time with async validation", async () => {
  const Test = () => {
    const { Field, formStatus, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onSuccess",
        initialValue: "",
        validate: (value) =>
          resolveAfter(100, value.length < 3 ? "Must be at least 3 characters" : undefined),
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="firstName">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
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

        <div>formStatus: {formStatus}</div>

        <button onClick={() => resetForm()}>Reset</button>
        <button onClick={() => submitForm()}>Submit</button>
      </form>
    );
  };

  render(<Test />);

  const input = await screen.findByLabelText("First name");
  const resetButton = await screen.findByText("Reset");
  const submitButton = await screen.findByText("Submit");

  await screen.findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await screen.findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await screen.findByText("formStatus: submitting");
  await screen.findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await screen.findByText("formStatus: untouched");
});

test("formStatus evolve though time with async submission", async () => {
  const Test = () => {
    const { Field, formStatus, resetForm, submitForm } = useForm({
      firstName: {
        strategy: "onSuccess",
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
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
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

        <div>formStatus: {formStatus}</div>

        <button onClick={() => resetForm()}>Reset</button>

        <button onClick={() => submitForm({ onSuccess: () => resolveAfter(100) })}>Submit</button>
      </form>
    );
  };

  render(<Test />);

  const input = await screen.findByLabelText("First name");
  const resetButton = await screen.findByText("Reset");
  const submitButton = await screen.findByText("Submit");

  await screen.findByText("formStatus: untouched");

  fireEvent.input(input, {
    target: { value: "Nicolas" },
  });

  await screen.findByText("formStatus: editing");
  fireEvent.click(submitButton);
  await screen.findByText("formStatus: submitting");
  await screen.findByText("formStatus: submitted");
  fireEvent.click(resetButton);
  await screen.findByText("formStatus: untouched");
});
