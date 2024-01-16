import { expect, test } from "vitest";
import { Validator, toOptionalValidator } from "../src";

test("sync validator to optional validator", () => {
  const error = "Must be at least 3 characters";

  const validator: Validator<string> = (value) => {
    if (value.length < 3) {
      return error;
    }
  };

  expect(validator("")).toBe(error);
  expect(validator("x")).toBe(error);
  expect(validator("Michel")).not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator);

  expect(optionalValidator("")).not.toBeDefined();
  expect(optionalValidator("x")).toBe(error);
  expect(optionalValidator("Michel")).not.toBeDefined();
});

test("sync validator to optional validator (without custom empty value)", () => {
  const error = "Must be at least 3 characters";

  const validator: Validator<string> = (value) => (value.length < 3 ? error : undefined);

  expect(validator("")).toBe(error);
  expect(validator("x")).toBe(error);
  expect(validator("Michel")).not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator);

  expect(optionalValidator("")).not.toBeDefined();
  expect(optionalValidator("x")).toBe(error);
  expect(optionalValidator("Michel")).not.toBeDefined();
});

test("sync validator to optional validator (with custom empty value)", () => {
  const error = "Number must be a position multiple of 2";

  const validator: Validator<number> = (value) =>
    value <= 0 || value % 2 !== 0 ? error : undefined;

  expect(validator(0)).toBe(error);
  expect(validator(1)).toBe(error);
  expect(validator(2)).not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator, (value) => value === 0);

  expect(optionalValidator(0)).not.toBeDefined();
  expect(optionalValidator(1)).toBe(error);
  expect(optionalValidator(2)).not.toBeDefined();
});
