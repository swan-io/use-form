import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import cardValidator from "card-validator";
import * as React from "react";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const CreditCardForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    cardNumber: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.number(value).isValid) {
          return "Card number is invalid";
        }
      },
    },
    expirationDate: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.expirationDate(value).isValid) {
          return "Expiration date is invalid";
        }
      },
    },
    cvc: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.cvv(value).isValid) {
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
    <Page title="Credit card">
      <form onSubmit={onSubmit}>
        <Field name="cardNumber">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
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

        <Field name="expirationDate">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="Expiration date"
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
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
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
