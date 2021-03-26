import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { isExpirationDateValid, isValid } from "creditcard.js";
import * as React from "react";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const CreditCardForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    cardNumber: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "Card number is required";
        }
        if (!isValid(value)) {
          return "Card number is invalid";
        }
      },
    },
    expireDate: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "Expire date is required";
        }
        const [month, year] = value.split("/");
        if (!isExpirationDateValid(month, year)) {
          return "Expire date is invalid";
        }
      },
    },
    cvc: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value.length !== 3) {
          return "CVC should have 3 characters";
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
    <Page title="Basic">
      <form onSubmit={onSubmit}>
        <Field name="cardNumber">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
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
        </Field>

        <Field name="expireDate">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
            <Input
              label="Expire date"
              error={error}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
              valid={valid}
              validating={validating}
              value={value}
            />
          )}
        </Field>

        <Field name="cvc">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
            <Input
              label="CVC"
              error={error}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
              valid={valid}
              validating={validating}
              value={value}
            />
          )}
        </Field>

        <Box height={4} />

        <HStack display="flex" align="initial" spacing={3}>
          <Button alignSelf="flex-end" onClick={resetForm}>
            Reset
          </Button>

          <Button colorScheme="green" onClick={onSubmit} type="submit">
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
