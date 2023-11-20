import { expect, test } from "vitest";
import { areFieldsMounted } from "../src";
import { NOT_MOUNTED, NotMounted } from "../src/notMounted";

test("check that every key is defined", () => {
  const object: {
    foo: string | NotMounted;
    bar: string | NotMounted;
    baz: string | NotMounted;
  } = {
    foo: "foo",
    bar: "bar",
    baz: NOT_MOUNTED,
  };

  expect(areFieldsMounted(object, ["foo"])).toBe(true);
  expect(areFieldsMounted(object, ["bar"])).toBe(true);
  expect(areFieldsMounted(object, [])).toBe(true);
  expect(areFieldsMounted(object, ["foo", "bar"])).toBe(true);

  expect(areFieldsMounted(object, ["foo", "bar", "baz"])).toBe(false);
});
