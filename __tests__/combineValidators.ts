import { combineValidators } from "../src";
import { resolveAfter } from "./utils/promises";

const validateRequired = (value: string) => {
  if (!value) {
    return "required";
  }
};

const validateMinLength = (maxLength: number) => (value: string) => {
  if (value.length < maxLength) {
    return "too short value";
  }
};

// can be done synchronously but add a delay to simulate async validation
const validateEmail = async (email: string) => {
  await resolveAfter(100);
  if (!/.+@.+\..{2,}/.test(email)) {
    return "invalid email";
  }
};

test("combine sync validations", () => {
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

test("combine sync and async validations", async () => {
  const validate = combineValidators(validateMinLength(6), validateEmail);

  const input1 = "hello";
  const expected1 = "too short value";
  // no need to await because there shouldn't be any async validation
  const output1 = validate(input1);

  const input2 = "hello@swan";
  const expected2 = "invalid email";
  // use await because email validation make `validate` async
  const output2 = await validate(input2);

  const input3 = "hello@swan.io";
  const expected3 = undefined;
  // use await because email validation make `validate` async
  const output3 = await validate(input3);

  expect(output1).toBe(expected1);
  expect(output2).toBe(expected2);
  expect(output3).toBe(expected3);
});
