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

test("sync validator to optional validator (with custom empty value)", () => {
  const error = "Number must be a position multiple of 2";

  const validator: Validator<number> = (value) => {
    if (value <= 0 || value % 2 !== 0) {
      return error;
    }
  };

  expect(validator(0)).toBe(error);
  expect(validator(1)).toBe(error);
  expect(validator(2)).not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator, 0);

  expect(optionalValidator(0)).not.toBeDefined();
  expect(optionalValidator(1)).toBe(error);
  expect(optionalValidator(2)).not.toBeDefined();
});

test("async validator to optional validator", async () => {
  const error = "Must be at least 3 characters";

  const validator: Validator<string> = async (value) => {
    if (value.length < 3) {
      return error;
    }
  };

  await expect(validator("")).resolves.toBe(error);
  await expect(validator("x")).resolves.toBe(error);
  await expect(validator("Michel")).resolves.not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator);

  expect(optionalValidator("")).not.toBeDefined(); // validator will be sync in this case
  await expect(optionalValidator("x")).resolves.toBe(error);
  await expect(optionalValidator("Michel")).resolves.not.toBeDefined();
});

test("async validator to optional validator (with custom empty value)", async () => {
  const error = "Number must be a position multiple of 2";

  const validator: Validator<number> = async (value) => {
    if (value <= 0 || value % 2 !== 0) {
      return error;
    }
  };

  await expect(validator(0)).resolves.toBe(error);
  await expect(validator(1)).resolves.toBe(error);
  await expect(validator(2)).resolves.not.toBeDefined();

  const optionalValidator = toOptionalValidator(validator, 0);

  expect(optionalValidator(0)).not.toBeDefined(); // validator will be sync in this case
  await expect(optionalValidator(1)).resolves.toBe(error);
  await expect(optionalValidator(2)).resolves.not.toBeDefined();
});
