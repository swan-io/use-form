import { expect, test } from "vitest";
import { areFieldsMounted, isFieldMounted } from "../src";
import { NOT_MOUNTED, NotMounted } from "../src/notMounted";

test("check that every key is defined", () => {
  const values: {
    foo: string | NotMounted;
    bar: string | NotMounted;
    baz: string | NotMounted;
  } = {
    foo: "foo",
    bar: "bar",
    baz: NOT_MOUNTED,
  };

  expect(isFieldMounted(values.foo)).toBe(true);
  expect(isFieldMounted(values.bar)).toBe(true);
  expect(isFieldMounted(values.baz)).toBe(false);

  expect(areFieldsMounted(values, ["foo"])).toBe(true);
  expect(areFieldsMounted(values, ["bar"])).toBe(true);
  expect(areFieldsMounted(values, [])).toBe(true);
  expect(areFieldsMounted(values, ["foo", "bar"])).toBe(true);

  expect(areFieldsMounted(values, ["foo", "bar", "baz"])).toBe(false);
});
