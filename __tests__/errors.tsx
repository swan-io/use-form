import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { test } from "vitest";
import { useForm } from "../src";

test("calling setError set a field error", async () => {
  const Test = () => {
    const { Field, setFieldError } = useForm({
      field: {
        initialValue: "",
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="field">
          {({ error }) => (error ? <div>{error}</div> : <div>no error</div>)}
        </Field>

        <button
          onClick={() => {
            setFieldError("field", "now with an error");
          }}
        >
          Set error
        </button>
      </form>
    );
  };

  render(<Test />);

  const setErrorButton = await screen.findByText("Set error");

  await screen.findByText("no error");
  fireEvent.click(setErrorButton);
  await screen.findByText("now with an error");
});
