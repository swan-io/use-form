import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import validator from "validator";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";
import { resolveAfter } from "../utils/promises";

export const AsyncSubmissionForm = () => {
  const { Field, resetForm, submitForm, formStatus } = useForm({
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

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submitForm(
      (values) =>
        resolveAfter(2000).then(() => {
          console.log("values", values);

          toast({
            title: "Submission succeeded",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }),
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
        <Field name="emailAddress">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
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

        <HStack spacing={3}>
          <Button onClick={resetForm}>Reset</Button>

          <Button
            colorScheme="green"
            disabled={formStatus === "submitting"}
            isLoading={formStatus === "submitting"}
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
