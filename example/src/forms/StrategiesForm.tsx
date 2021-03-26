import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "../../../src";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

const validate = (value: string) => {
  if (value.length < 3) {
    return "Must be at least 3 characters";
  }
};

export const StrategiesForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    onFirstChange: {
      strategy: "onFirstChange",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate,
    },
    onFirstSuccess: {
      strategy: "onFirstSuccess",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate,
    },
    onFirstBlur: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate,
    },
    onFirstSuccessOrFirstBlur: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate,
    },
    onSubmit: {
      strategy: "onSubmit",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate,
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
    <Page title="Validation strategies">
      <form onSubmit={onSubmit}>
        <Field name="onFirstChange">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstChange"
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

        <Field name="onFirstSuccess">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstSuccess"
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

        <Field name="onFirstBlur">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstBlur"
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

        <Field name="onFirstSuccessOrFirstBlur">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstSuccessOrFirstBlur (default)"
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

        <Field name="onSubmit">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onSubmit"
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
