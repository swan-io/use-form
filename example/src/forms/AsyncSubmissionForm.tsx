import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import validator from "validator";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const AsyncSubmissionForm = () => {
  const { Field, resetForm, submitForm, formStatus } = useForm({
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
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!validator.isEmail(value)) {
          return "A valid email is required";
        }
      },
    },
  });

  const submitting = formStatus === "submitting";

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitForm(
      async (values) => {
        console.log("values", values);
        await new Promise((resolve) => setTimeout(resolve, 2000));

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
    <Page title="Async submission">
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

          <Button
            isLoading={submitting}
            disabled={submitting}
            colorScheme="green"
            onClick={onSubmit}
            type="submit"
          >
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
