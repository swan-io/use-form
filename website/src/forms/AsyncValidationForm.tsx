import { Button } from "@chakra-ui/button";
import { Code, HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";
import { Input } from "../components/Input";
import { Page } from "../components/Page";
import { resolveAfter } from "../utils/promises";

export const AsyncValidationForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    emailAddress: {
      strategy: "onChange",
      initialValue: "",
      debounceInterval: 250,
      sanitize: (value) => value.trim(),
      validate: (value) =>
        resolveAfter(1000, !validator.isEmail(value) ? "A valid email is required" : undefined),
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
      title="Async validation"
      description={
        <>
          Validation will be triggered on each keystroke, <Code>debounceInterval</Code> is set to{" "}
          <Code>250</Code> (ms).
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Field name="emailAddress">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="Email address"
              validation="Must be valid"
              strategy="onChange"
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

        <HStack justifyContent="flex-end" spacing={3}>
          <Button onClick={resetForm} width={100}>
            Reset
          </Button>

          <Button colorScheme="green" type="submit" onClick={onSubmit} width={100}>
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
