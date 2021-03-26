import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import validator from "validator";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

const checkEmail = (value: string): Promise<string | void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (validator.isEmail(value)) {
        resolve();
      } else {
        resolve("A valid email is required");
      }
    }, 1000);
  });

export const AsyncValidationForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    firstName: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "First name is required";
        }
      },
    },
    lastName: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (value === "") {
          return "Last name is required";
        }
      },
    },
    emailAddress: {
      strategy: "onFirstChange",
      initialValue: "",
      debounceInterval: 250,
      sanitize: (value) => value.trim(),
      validate: (value) => checkEmail(value),
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
    <Page title="Async validation">
      <form onSubmit={onSubmit}>
        <Field name="firstName">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
            <Input
              label="First name"
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

        <Field name="lastName">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
            <Input
              label="Last name"
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

        <Field name="emailAddress">
          {({ ref, onBlur, onChange, value, valid, validating, error }) => (
            <Input
              label="Email address"
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
