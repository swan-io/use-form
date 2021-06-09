import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { useForm } from "../src";

test("Count the number of updates", async () => {
  let nameUpdateCount = 0;

  const Test = () => {
    const { Field, listenField } = useForm({
      firstName: {
        strategy: "onFirstChange",
        initialValue: "",
        validate: (value) => {
          if (value.length < 3) {
            return "Must be at least 3 characters";
          }
        },
      },
    });

    const [nameCopy, setNameCopy] = React.useState("");

    React.useEffect(() => {
      const removeListener = listenField("firstName", ({ value }) => {
        nameUpdateCount++;
        setNameCopy(value);
      });

      return () => {
        removeListener();
      };
    }, []);

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

        <div>value: {nameCopy}</div>
      </form>
    );
  };

  render(<Test />);

  expect(nameUpdateCount).toEqual(0);

  const firstNameInput = await screen.findByLabelText("First name");

  // fireEvent doesn't simulate typing, so viewerRenderCount will only be increased by 1
  fireEvent.input(firstNameInput, { target: { value: "Ni" } });

  expect(nameUpdateCount).toEqual(1);

  await screen.findByText("value: Ni");

  fireEvent.input(firstNameInput, { target: { value: "Nicolas" } });

  expect(nameUpdateCount).toEqual(2);

  await screen.findByText("value: Nicolas");
});
