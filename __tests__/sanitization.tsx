import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { test } from "vitest";
import { useForm } from "../src";

test("input sanitization is perform onBlur", async () => {
  const Test = () => {
    const { Field, sanitizeField } = useForm({
      firstName: {
        initialValue: "",
        sanitize: (value) => value.trim(),
      },
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Field name="firstName">
          {({ ref, onBlur, onChange, value }) => (
            <>
              <label htmlFor="firstName">First name</label>

              <input
                ref={ref}
                type="text"
                id="firstName"
                value={value}
                onBlur={() => {
                  sanitizeField("firstName");
                  onBlur();
                }}
                onChange={(e) => {
                  e.preventDefault();
                  onChange(e.target.value);
                }}
              />

              <span>Sanitized value: "{value}"</span>
            </>
          )}
        </Field>
      </form>
    );
  };

  render(<Test />);

  const input = await screen.findByLabelText("First name");

  fireEvent.focus(input);
  fireEvent.input(input, { target: { value: "  Nicolas  " } });
  fireEvent.blur(input);

  await screen.findByText('Sanitized value: "Nicolas"');
});
