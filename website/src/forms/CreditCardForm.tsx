import { Button } from "@chakra-ui/button";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { HStack, Spacer } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import cardValidator from "card-validator";
import * as React from "react";
import { useForm } from "react-ux-form";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const CreditCardForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    cardNumber: {
      strategy: "onSuccessOrBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.number(value).isValid) {
          return "Card number is invalid";
        }
      },
    },
    expirationDate: {
      strategy: "onSuccessOrBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.expirationDate(value).isValid) {
          return "Expiration date is invalid";
        }
      },
    },
    cvc: {
      strategy: "onSuccessOrBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.cvv(value).isValid) {
          return "CVC should have 3 characters";
        }
      },
    },
  });

  const toast = useToast();

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

  return (
    <Page
      title="Credit card"
      description={
        <>
          You can try it by yourself using random credit card numbers from{" "}
          <Link
            href="https://www.creditcardvalidator.org/generator"
            isExternal={true}
            color="gray.600"
            fontWeight="medium"
          >
            creditcardvalidator.org <ExternalLinkIcon marginTop={-1} />
          </Link>
          <br />
          Validation is performed using{" "}
          <Link
            href="https://www.npmjs.com/package/card-validator"
            isExternal={true}
            color="gray.600"
            fontWeight="medium"
          >
            card-validator <ExternalLinkIcon marginTop={-1} />
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Field name="cardNumber">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="Card number"
              validation="Must be valid"
              placeholder="4242424242424242"
              strategy="onFirstSuccessOrFirstBlur"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
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
              validation="Must be valid"
              placeholder="01/28"
              strategy="onFirstSuccessOrFirstBlur"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
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
              validation="Must be valid"
              placeholder="123"
              strategy="onFirstSuccessOrFirstBlur"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
              ref={ref}
              valid={valid}
              validating={validating}
              value={value}
            />
          )}
        </Field>

        <Spacer height={4} />

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
