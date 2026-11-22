import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { expect, test } from "vitest";
import { useForm } from "../src";

test("FieldsListener re-renders when a value that JSON can't represent changes", async () => {
  const Test = () => {
    const { Field, FieldsListener } = useForm({
      tags: {
        strategy: "onChange",
        initialValue: new Set<string>(),
      },
    });

    return (
      <>
        <Field name="tags">
          {({ value, onChange }) => (
            <>
              <button onClick={() => onChange(new Set([...value, "a"]))}>Add a</button>
              <button onClick={() => onChange(new Set([...value, "b"]))}>Add b</button>
            </>
          )}
        </Field>

        <FieldsListener names={["tags"]}>
          {({ tags }) => <div>tags: {[...tags.value].join(",") || "none"}</div>}
        </FieldsListener>
      </>
    );
  };

  render(<Test />);

  await screen.findByText("tags: none");

  fireEvent.click(await screen.findByText("Add a"));
  await screen.findByText("tags: a");

  fireEvent.click(await screen.findByText("Add b"));
  await screen.findByText("tags: a,b");

  expect(screen.queryByText("tags: a")).toBeNull();
});

test("FieldsListener renders a value that JSON.stringify can't serialize", async () => {
  type Node = { name: string; parent?: Node };

  const root: Node = { name: "root" };
  root.parent = root; // circular

  const Test = () => {
    const { FieldsListener } = useForm({
      node: {
        initialValue: root,
      },
    });

    return (
      <FieldsListener names={["node"]}>
        {({ node }) => <div>node: {node.value.name}</div>}
      </FieldsListener>
    );
  };

  render(<Test />);

  await screen.findByText("node: root");
});
