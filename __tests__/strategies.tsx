import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { test } from "vitest";
import { useForm } from "../src";

const sanitize = (value: string) => value.trim();
const validate = (value: string) => {
  if (value.length < 3) {
    return "Must be at least 3 characters";
  }
};

test("validation strategies give feedback at the right time", async () => {
  const Test = () => {
    const { Field, resetForm, submitForm } = useForm({
      onChange: {
        strategy: "onChange",
        initialValue: "",
        sanitize,
        validate,
      },
      onSuccess: {
        strategy: "onSuccess",
        initialValue: "",
        sanitize,
        validate,
      },
      onBlur: {
        strategy: "onBlur",
        initialValue: "",
        sanitize,
        validate,
      },
      onSuccessOrBlur: {
        strategy: "onSuccessOrBlur",
        initialValue: "",
        sanitize,
        validate,
      },
      onSubmit: {
        strategy: "onSubmit",
        initialValue: "",
        sanitize,
        validate,
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="onChange">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onChange">onChange</label>

              <input
                type="text"
                id="onChange"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onChange idle</div>}
              {valid && <div>onChange valid</div>}
              {validating && <div>onChange validating</div>}
              {error && <div>onChange error</div>}
            </>
          )}
        </Field>

        <Field name="onSuccess">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onSuccess">onSuccess</label>

              <input
                type="text"
                id="onSuccess"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onSuccess idle</div>}
              {valid && <div>onSuccess valid</div>}
              {validating && <div>onSuccess validating</div>}
              {error && <div>onSuccess error</div>}
            </>
          )}
        </Field>

        <Field name="onBlur">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onBlur">onBlur</label>

              <input
                type="text"
                id="onBlur"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onBlur idle</div>}
              {valid && <div>onBlur valid</div>}
              {validating && <div>onBlur validating</div>}
              {error && <div>onBlur error</div>}
            </>
          )}
        </Field>

        <Field name="onSuccessOrBlur">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onSuccessOrBlur">onSuccessOrBlur</label>

              <input
                type="text"
                id="onSuccessOrBlur"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onSuccessOrBlur idle</div>}
              {valid && <div>onSuccessOrBlur valid</div>}
              {validating && <div>onSuccessOrBlur validating</div>}
              {error && <div>onSuccessOrBlur error</div>}
            </>
          )}
        </Field>

        <Field name="onSubmit">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onSubmit">onSubmit</label>

              <input
                type="text"
                id="onSubmit"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onSubmit idle</div>}
              {valid && <div>onSubmit valid</div>}
              {validating && <div>onSubmit validating</div>}
              {error && <div>onSubmit error</div>}
            </>
          )}
        </Field>

        <button onClick={() => resetForm()}>Reset</button>
        <button onClick={() => submitForm()}>Submit</button>
      </form>
    );
  };

  render(<Test />);

  let input = await screen.findByLabelText("onChange");
  const resetButton = await screen.findByText("Reset");
  const submitButton = await screen.findByText("Submit");

  await screen.findByText("onChange idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onChange error");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await screen.findByText("onChange valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onChange error");

  fireEvent.click(resetButton);
  input = await screen.findByLabelText("onSuccess");

  await screen.findByText("onSuccess idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSuccess idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await screen.findByText("onSuccess valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSuccess error");

  fireEvent.click(resetButton);
  input = await screen.findByLabelText("onBlur");

  await screen.findByText("onBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onBlur idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await screen.findByText("onBlur idle");
  fireEvent.blur(input);
  await screen.findByText("onBlur valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onBlur error");

  fireEvent.click(resetButton);
  input = await screen.findByLabelText("onSuccessOrBlur");

  await screen.findByText("onSuccessOrBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSuccessOrBlur idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await screen.findByText("onSuccessOrBlur valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSuccessOrBlur error");

  fireEvent.click(resetButton);

  await screen.findByText("onSuccessOrBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSuccessOrBlur idle");
  fireEvent.blur(input);
  await screen.findByText("onSuccessOrBlur error");

  fireEvent.click(resetButton);
  input = await screen.findByLabelText("onSubmit");

  await screen.findByText("onSubmit idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSubmit idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await screen.findByText("onSubmit idle");
  fireEvent.click(submitButton);
  await screen.findByText("onSubmit valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await screen.findByText("onSubmit error");
});
