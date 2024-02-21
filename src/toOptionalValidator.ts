import { isEmptyString } from "./helpers";
import { Validator } from "./types";

export const toOptionalValidator =
  <Value, ErrorMessage = string>(
    validator: Validator<Value, ErrorMessage>,
    ...args: Value extends string
      ? [isEmptyValue?: (value: Value) => boolean]
      : [isEmptyValue: (value: Value) => boolean]
  ): Validator<Value, ErrorMessage> =>
  (value) => {
    const [isEmptyValue = isEmptyString] = args;

    if (!isEmptyValue(value)) {
      return validator(value);
    }
  };
