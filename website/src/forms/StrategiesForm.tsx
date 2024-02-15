import { Button } from "@chakra-ui/button";
import { HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useForm } from "@swan-io/use-form";
import * as React from "react";
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
    onChange: {
      strategy: "onChange",
      initialValue: "",
      sanitize,
      validate,
    },
    onSuccess: {
      strategy: "onSuccess",
      initialValue: "",
      sanitize,
      validate,
    },
    onBlur: {
      strategy: "onBlur",
      initialValue: "",
      sanitize,
      validate,
    },
    onSuccessOrBlur: {
      strategy: "onSuccessOrBlur",
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

    submitForm({
      onSuccess: (values) => {
        console.log("values", values);

        toast({
          title: "Submission succeeded",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      onFailure: (errors) => {
        console.log("errors", errors);

        toast({
          title: "Submission failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <Page
      title="Validation strategies"
      description="All these fields use the same sanitization rules (the value is trimmed), the same validation rule (the value must be at least 3 characters long) but different validation strategies, so you can easily play with each."
    >
      <form
        onSubmit={onSubmit}
        onReset={() => {
          resetForm();
        }}
      >
        <Field name="onChange">
          {({ error, onBlur, onChange, ref, valid, value }) => (
            <Input
              label="onChange"
              validation="Must be at least 3 characters long"
              strategy="onChange"
              placeholder="…"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
              ref={ref}
              valid={valid}
              value={value}
            />
          )}
        </Field>

        <Field name="onSuccess">
          {({ error, onBlur, onChange, ref, valid, value }) => (
            <Input
              label="onSuccess"
              validation="Must be at least 3 characters long"
              strategy="onSuccess"
              placeholder="…"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
              ref={ref}
              valid={valid}
              value={value}
            />
          )}
        </Field>

        <Field name="onBlur">
          {({ error, onBlur, onChange, ref, valid, value }) => (
            <Input
              label="onBlur"
              validation="Must be at least 3 characters long"
              strategy="onBlur"
              placeholder="…"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
              ref={ref}
              valid={valid}
              value={value}
            />
          )}
        </Field>

        <Field name="onSuccessOrBlur">
          {({ error, onBlur, onChange, ref, valid, value }) => (
            <Input
              label="onSuccessOrBlur (default)"
              validation="Must be at least 3 characters long"
              strategy="onSuccessOrBlur"
              placeholder="…"
              error={error}
              onBlur={onBlur}
              onChangeText={onChange}
              ref={ref}
              valid={valid}
              value={value}
            />
          )}
        </Field>

        <Field name="onSubmit">
          {({ error, onBlur, onChange, ref, valid, value }) => (
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
              value={value}
            />
          )}
        </Field>

        <Spacer height={4} />

        <HStack justifyContent="flex-end" spacing={3}>
          <Button type="reset" width={100}>
            Reset
          </Button>

          <Button colorScheme="green" type="submit" width={100}>
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
