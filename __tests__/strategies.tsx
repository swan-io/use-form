import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
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
      onFirstChange: {
        strategy: "onFirstChange",
        initialValue: "",
        sanitize,
        validate,
      },
      onFirstSuccess: {
        strategy: "onFirstSuccess",
        initialValue: "",
        sanitize,
        validate,
      },
      onFirstBlur: {
        strategy: "onFirstBlur",
        initialValue: "",
        sanitize,
        validate,
      },
      onFirstSuccessOrFirstBlur: {
        strategy: "onFirstSuccessOrFirstBlur",
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
        <Field name="onFirstChange">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onFirstChange">onFirstChange</label>

              <input
                type="text"
                id="onFirstChange"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onFirstChange idle</div>}
              {valid && <div>onFirstChange valid</div>}
              {validating && <div>onFirstChange validating</div>}
              {error && <div>onFirstChange error</div>}
            </>
          )}
        </Field>

        <Field name="onFirstSuccess">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onFirstSuccess">onFirstSuccess</label>

              <input
                type="text"
                id="onFirstSuccess"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onFirstSuccess idle</div>}
              {valid && <div>onFirstSuccess valid</div>}
              {validating && <div>onFirstSuccess validating</div>}
              {error && <div>onFirstSuccess error</div>}
            </>
          )}
        </Field>

        <Field name="onFirstBlur">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onFirstBlur">onFirstBlur</label>

              <input
                type="text"
                id="onFirstBlur"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onFirstBlur idle</div>}
              {valid && <div>onFirstBlur valid</div>}
              {validating && <div>onFirstBlur validating</div>}
              {error && <div>onFirstBlur error</div>}
            </>
          )}
        </Field>

        <Field name="onFirstSuccessOrFirstBlur">
          {({ error, onBlur, onChange, valid, validating, value }) => (
            <>
              <label htmlFor="onFirstSuccessOrFirstBlur">onFirstSuccessOrFirstBlur</label>

              <input
                type="text"
                id="onFirstSuccessOrFirstBlur"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              {!(valid || error) && <div>onFirstSuccessOrFirstBlur idle</div>}
              {valid && <div>onFirstSuccessOrFirstBlur valid</div>}
              {validating && <div>onFirstSuccessOrFirstBlur validating</div>}
              {error && <div>onFirstSuccessOrFirstBlur error</div>}
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

        <button onClick={(e) => resetForm()}>Reset</button>
        <button onClick={(e) => submitForm((values) => {})}>Submit</button>
      </form>
    );
  };

  const { debug, findByLabelText, findByText } = render(<Test />);

  let input = await findByLabelText("onFirstChange");
  const resetButton = await findByText("Reset");
  const submitButton = await findByText("Submit");

  await findByText("onFirstChange idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstChange error");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await findByText("onFirstChange valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstChange error");

  fireEvent.click(resetButton);
  input = await findByLabelText("onFirstSuccess");

  await findByText("onFirstSuccess idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstSuccess idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await findByText("onFirstSuccess valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstSuccess error");

  fireEvent.click(resetButton);
  input = await findByLabelText("onFirstBlur");

  await findByText("onFirstBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstBlur idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await findByText("onFirstBlur idle");
  fireEvent.blur(input);
  await findByText("onFirstBlur valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstBlur error");

  fireEvent.click(resetButton);
  input = await findByLabelText("onFirstSuccessOrFirstBlur");

  await findByText("onFirstSuccessOrFirstBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstSuccessOrFirstBlur idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await findByText("onFirstSuccessOrFirstBlur valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstSuccessOrFirstBlur error");

  fireEvent.click(resetButton);

  await findByText("onFirstSuccessOrFirstBlur idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onFirstSuccessOrFirstBlur idle");
  fireEvent.blur(input);
  await findByText("onFirstSuccessOrFirstBlur error");

  fireEvent.click(resetButton);
  input = await findByLabelText("onSubmit");

  await findByText("onSubmit idle");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onSubmit idle");
  fireEvent.input(input, { target: { value: "Nicolas" } });
  await findByText("onSubmit idle");
  fireEvent.click(submitButton);
  await findByText("onSubmit valid");
  fireEvent.input(input, { target: { value: "Ni" } });
  await findByText("onSubmit error");
});
