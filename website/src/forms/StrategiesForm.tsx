import { Button } from "@chakra-ui/button";
import { HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

const sanitize = (value: string) => value.trim();
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
      sanitize,
      validate,
    },
    onFirstSuccess: {
      strategy: "onFirstSuccess",
      initialValue: "",
      sanitize,
      validate,
    },
    onFirstBlur: {
      strategy: "onFirstBlur",
      initialValue: "",
      sanitize,
      validate,
    },
    onFirstSuccessOrFirstBlur: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize,
      validate,
    },
    onSubmit: {
      strategy: "onSubmit",
      initialValue: "",
      sanitize,
      validate,
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
      title="Validation strategies"
      description="All these fields use the same sanitization rules (the value is trimmed), the same validation rule (the value must be at least 3 characters long) but different validation strategies, so you can easily play with each."
    >
      <form onSubmit={onSubmit}>
        <Field name="onFirstChange">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstChange"
              validation="Must be at least 3 characters long"
              strategy="onFirstChange"
              placeholder="…"
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

        <Field name="onFirstSuccess">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstSuccess"
              validation="Must be at least 3 characters long"
              strategy="onFirstSuccess"
              placeholder="…"
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

        <Field name="onFirstBlur">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstBlur"
              validation="Must be at least 3 characters long"
              strategy="onFirstBlur"
              placeholder="…"
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

        <Field name="onFirstSuccessOrFirstBlur">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onFirstSuccessOrFirstBlur (default)"
              validation="Must be at least 3 characters long"
              strategy="onFirstSuccessOrFirstBlur"
              placeholder="…"
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

        <Field name="onSubmit">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="onSubmit"
              validation="Must be at least 3 characters long"
              strategy="onSubmit"
              placeholder="…"
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
