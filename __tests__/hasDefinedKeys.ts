import { expect, test } from "vitest";
import { hasDefinedKeys } from "../src";

test("check that every key is defined", () => {
  const object: Partial<{
    foo: string;
    bar: string;
    baz: string;
  }> = {
    foo: "foo",
    bar: "bar",
  };

  expect(hasDefinedKeys(object, ["foo"])).toBe(true);
  expect(hasDefinedKeys(object, ["bar"])).toBe(true);
  expect(hasDefinedKeys(object, [])).toBe(true);
  expect(hasDefinedKeys(object, ["foo", "bar"])).toBe(true);

  expect(hasDefinedKeys(object, ["foo", "bar", "baz"])).toBe(false);
});
