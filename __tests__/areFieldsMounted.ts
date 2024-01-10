import { expect, test } from "vitest";
import { areValuesSet, isValueSet } from "../src";
import { UNMOUNTED, Unmounted } from "../src/areFieldsMounted";

test("check that every key is defined", () => {
  const values: {
    foo: string | Unmounted;
    bar: string | Unmounted;
    baz: string | Unmounted;
  } = {
    foo: "foo",
    bar: "bar",
    baz: UNMOUNTED,
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
