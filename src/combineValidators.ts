import { Validator } from "./types";

export const combineValidators =
  <Value, ErrorMessage = string>(
    ...validators: (Validator<Value, ErrorMessage> | false)[]
  ): Validator<Value, ErrorMessage> =>
  (value) => {
    const [validator, ...nextValidators] = validators;

    if (validator != null && validator !== false) {
      const result = validator(value);

      if (typeof result !== "undefined") {
        return result;
      }
    }

    if (nextValidators.length > 0) {
      return combineValidators(...nextValidators)(value);
    }
  };
