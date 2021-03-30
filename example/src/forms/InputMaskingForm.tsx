import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import cardValidator from "card-validator";
import * as React from "react";
import { Rifm } from "rifm";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

const formatCardNumber = (string: string) => {
  const digits = (string.match(/\d+/g) || []).join("");
  const chars = digits.split("");

  const res = chars
    .reduce(
      (acc, char, index) => ([4, 8, 12, 16].includes(index) ? `${acc} ${char}` : `${acc}${char}`),
      "",
    )
    .substr(0, 19);

  return string.endsWith(" ") && [4, 9, 14, 19].includes(res.length) ? `${res} ` : res;
};

const appendSpace = (res: string) => ([4, 9, 14].includes(res.length) ? `${res} ` : res);

export const InputMaskingForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    cardNumber: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        console.log({ value });

        if (!cardValidator.number(value).isValid) {
          return "Card number is invalid";
        }
      },
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitForm(
      (values) => {
        console.log("values", values);

        toast({
          title: "Submission succeeded",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      (errors) => {
        console.log("errors", errors);

        toast({
          title: "Submission failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    );
  };

  const toast = useToast();

  return (
    <Page title="Input masking">
      <form onSubmit={onSubmit}>
        <Field name="cardNumber">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Rifm
              accept={/\d+/g}
              mask={19 <= value.length}
              format={formatCardNumber}
              value={value}
              onChange={onChange}
              append={appendSpace}
            >
              {({ value, onChange }) => (
                <Input
                  label="Card number"
                  error={error}
                  onBlur={onBlur}
                  onChange={onChange}
                  ref={ref}
                  valid={valid}
                  validating={validating}
                  value={value}
                />
              )}
            </Rifm>
          )}
        </Field>

        <Box height={4} />

        <HStack spacing={3}>
          <Button onClick={resetForm}>Reset</Button>

          <Button colorScheme="green" onClick={onSubmit} type="submit">
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
