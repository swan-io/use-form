import { isPromise } from "./helpers";
import { Validator } from "./types";

export const combineValidators =
  <Value, ErrorMessage = string>(
    ...validators: (Validator<Value, ErrorMessage> | false)[]
  ): Validator<Value, ErrorMessage> =>
  (value) => {
    const [validator, ...nextValidators] = validators;

    if (validator) {
      const result = validator(value);

      if (isPromise(result)) {
        return result.then((error) => {
          if (typeof error !== "undefined") {
            return error;
          }
          if (nextValidators.length > 0) {
            return combineValidators(...nextValidators)(value);
          }
        });
      }

      if (typeof result !== "undefined") {
        return result;
      }
    }

    if (nextValidators.length > 0) {
      return combineValidators(...nextValidators)(value);
    }
  };
