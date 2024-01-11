import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { expect, test } from "vitest";
import { useForm } from "../src";

test("Count the number of updates", async () => {
  let nameUpdateCount = 0;

  const Test = () => {
    const { Field, listenFields } = useForm({
      firstName: {
        strategy: "onChange",
        initialValue: "",
      },
      lastName: {
        strategy: "onChange",
        initialValue: "",
      },
    });

    const [fullName, setFullName] = React.useState("");

    React.useEffect(() => {
      const removeListener = listenFields(["firstName", "lastName"], ({ firstName, lastName }) => {
        nameUpdateCount++;
        setFullName([firstName.value, lastName.value].filter(Boolean).join(" "));
      });

      return () => {
        removeListener();
      };
    }, [listenFields]);

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

        <div>value: {fullName}</div>
      </form>
    );
  };

  render(<Test />);

  expect(nameUpdateCount).toEqual(0);

  const firstNameInput = await screen.findByLabelText("First name");
  const lastNameInput = await screen.findByLabelText("Last name");

  // fireEvent doesn't simulate typing, so viewerRenderCount will only be increased by 1
  fireEvent.input(firstNameInput, { target: { value: "Ni" } });

  expect(nameUpdateCount).toEqual(1);

  await screen.findByText("value: Ni");

  fireEvent.input(firstNameInput, { target: { value: "Nicolas" } });

  expect(nameUpdateCount).toEqual(2);

  await screen.findByText("value: Nicolas");

  fireEvent.input(lastNameInput, { target: { value: "Saison" } });

  expect(nameUpdateCount).toEqual(3);

  await screen.findByText("value: Nicolas Saison");
});
