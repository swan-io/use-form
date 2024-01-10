import { expect, test } from "vitest";
import { areValuesSet, isValueSet } from "../src";
import { NONE, None } from "../src/areFieldsMounted";

test("check that every key is defined", () => {
  const values: {
    foo: string | None;
    bar: string | None;
    baz: string | None;
  } = {
    foo: "foo",
    bar: "bar",
    baz: NONE,
  };

  expect(isValueSet(values.foo)).toBe(true);
  expect(isValueSet(values.bar)).toBe(true);
  expect(isValueSet(values.baz)).toBe(false);

  expect(areValuesSet(values, ["foo"])).toBe(true);
  expect(areValuesSet(values, ["bar"])).toBe(true);
  expect(areValuesSet(values, [])).toBe(true);
  expect(areValuesSet(values, ["foo", "bar"])).toBe(true);

  expect(areValuesSet(values, ["foo", "bar", "baz"])).toBe(false);
});
