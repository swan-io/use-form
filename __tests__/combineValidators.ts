import { expect, test } from "vitest";
import { combineValidators } from "../src";

const validateRequired = (value: string) => {
  if (!value) {
    return "required";
  }
};

const validateMinLength = (minLength: number) => (value: string) => {
  if (value.length < minLength) {
    return "too short value";
  }
};

const validateEmail = (email: string) => {
  if (!/.+@.+\..{2,}/.test(email)) {
    return "invalid email";
  }
};

test("combine required and min length sync validations", () => {
  const validate = combineValidators(validateRequired, validateMinLength(6));

  const input1 = "";
  const expected1 = "required";
  const output1 = validate(input1);

  const input2 = "hello";
  const expected2 = "too short value";
  const output2 = validate(input2);

  const input3 = "hello world";
  const expected3 = undefined;
  const output3 = validate(input3);

  expect(output1).toBe(expected1);
  expect(output2).toBe(expected2);
  expect(output3).toBe(expected3);
});

test("combine min length and email sync validations", () => {
  const validate = combineValidators(validateMinLength(6), validateEmail);

  const input1 = "hello";
  const expected1 = "too short value";
  const output1 = validate(input1);

  const input2 = "hello@swan";
  const expected2 = "invalid email";
  const output2 = validate(input2);

  const input3 = "hello@swan.io";
  const expected3 = undefined;
  const output3 = validate(input3);

  expect(output1).toBe(expected1);
  expect(output2).toBe(expected2);
  expect(output3).toBe(expected3);
});
