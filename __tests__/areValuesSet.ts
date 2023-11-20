import { expect, test } from "vitest";
import { areValuesSet, isValueSet } from "../src";
import { UNSET, Unset } from "../src/areValuesSet";

test("check that every key is defined", () => {
  const values: {
    foo: string | Unset;
    bar: string | Unset;
    baz: string | Unset;
  } = {
    foo: "foo",
    bar: "bar",
    baz: UNSET,
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
