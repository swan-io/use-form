import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { expect, test } from "vitest";
import { useForm } from "../src";

test("FieldsListener can unmount when its field is removed from the config", async () => {
  const Test = () => {
    const [withLastName, setWithLastName] = React.useState(true);

    const { Field, FieldsListener } = useForm<Record<string, string>>({
      firstName: { initialValue: "" },
      ...(withLastName && { lastName: { initialValue: "Doe" } }),
    });

    return (
      <>
        <Field name="firstName">
          {({ value, onChange }) => (
            <input
              aria-label="First name"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </Field>

        {withLastName && (
          <FieldsListener names={["lastName"]}>
            {({ lastName }) => <div>last name: {lastName.value}</div>}
          </FieldsListener>
        )}

        <button onClick={() => setWithLastName(false)}>Remove last name</button>
      </>
    );
  };

  render(<Test />);

  await screen.findByText("last name: Doe");
  fireEvent.click(await screen.findByText("Remove last name"));

  expect(screen.queryByText("last name: Doe")).toBeNull();

  // The form keeps working after the removal
  fireEvent.change(await screen.findByLabelText("First name"), { target: { value: "Nicolas" } });
  expect((await screen.findByLabelText<HTMLInputElement>("First name")).value).toBe("Nicolas");
});
