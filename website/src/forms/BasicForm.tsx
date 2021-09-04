import { Button } from "@chakra-ui/button";
import { HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const BasicForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    firstName: {
      strategy: "onBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "First name is required";
        }
      },
    },
    lastName: {
      strategy: "onBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "Last name is required";
        }
      },
    },
    emailAddress: {
      strategy: "onSuccessOrBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!validator.isEmail(value)) {
          return "A valid email is required";
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
      title="Basic"
      description={
        <>
          A common form example which play with at least two different strategies.
          <br />
          Note that all values are sanitized using trimming.
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Field name="firstName">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="First name"
              validation="Required"
              strategy="onBlur"
              placeholder="John"
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

        <Field name="lastName">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="Last name"
              validation="Required"
              strategy="onBlur"
              placeholder="Doe"
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

        <Field name="emailAddress">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="Email address"
              validation="Must be valid"
              strategy="onSuccessOrBlur"
              placeholder="john.doe@example.org"
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
