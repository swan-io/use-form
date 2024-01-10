import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { expect, test } from "vitest";
import { useForm } from "../src";

test("FieldsListener is synchronized with fields states", async () => {
  let viewerRenderCount = 0;
  let formRenderCount = 0;

  const FirstNameViewer = ({
    value,
    validating,
    valid,
    error,
  }: {
    value: string;
    validating: boolean;
    valid: boolean;
    error?: string;
  }) => {
    viewerRenderCount++;

    return (
      <>
        <div>value: {value}</div>
        {!(valid || error) && <div>idle</div>}
        {valid && <div>valid</div>}
        {validating && <div>validating</div>}
        {error && <div>error</div>}
      </>
    );
  };

  const Test = () => {
    formRenderCount++;

    const { Field, FieldsListener, resetForm } = useForm({
      firstName: {
        strategy: "onChange",
        initialValue: "",
        validate: (value) => {
          if (value.length < 3) {
            return "Must be at least 3 characters";
          }
        },
      },
      lastName: {
        strategy: "onChange",
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
          {({ value, onBlur, onChange }) => (
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
            </>
          )}
        </Field>

        <FieldsListener names={["firstName"]}>
          {({ firstName }) => <FirstNameViewer {...firstName} />}
        </FieldsListener>

        <Field name="lastName">
          {({ value, onBlur, onChange }) => (
            <>
              <label htmlFor="lastName">Last name</label>

              <input
                type="text"
                id="lastName"
                value={value}
                onBlur={onBlur}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />
            </>
          )}
        </Field>

        <button onClick={() => resetForm()}>Reset</button>
      </form>
    );
  };

  render(<Test />);

  expect(formRenderCount).toEqual(1);
  expect(viewerRenderCount).toEqual(1);

  const firstNameInput = await screen.findByLabelText("First name");
  const lastNameInput = await screen.findByLabelText("Last name");

  // fireEvent doesn't simulate typing, so viewerRenderCount will only be increased by 1
  fireEvent.input(firstNameInput, { target: { value: "Ni" } });

  await screen.findByText("value: Ni");
  await screen.findByText("error");

  expect(formRenderCount).toEqual(2);
  expect(viewerRenderCount).toEqual(2);

  fireEvent.input(firstNameInput, { target: { value: "Nicolas" } });

  expect(formRenderCount).toEqual(2);
  expect(viewerRenderCount).toEqual(3);

  await screen.findByText("value: Nicolas");
  await screen.findByText("valid");

  fireEvent.input(lastNameInput, { target: { value: "Saison" } });

  expect(formRenderCount).toEqual(2);
  expect(viewerRenderCount).toEqual(3);
});
