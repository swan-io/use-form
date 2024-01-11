import { Button } from "@chakra-ui/button";
import { Code, HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const FieldsListenerForm = () => {
  const { Field, FieldsListener, resetForm, submitForm } = useForm({
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
      title="Fields listener"
      description={
        <>
          Using <Code>listenFields</Code> and the <Code>{"<FieldsListener />"}</Code> component,
          it's really easy to synchronise components states and perform side-effects several fields
          values changes.
        </>
      }
    >
      <FieldsListener names={["firstName", "lastName", "emailAddress"]}>
        {(states) => (
          <pre
            style={{
              backgroundColor: "#fafafa",
              color: "#1A202C",
              borderRadius: 6,
              borderWidth: 1,
              fontSize: 14,
              padding: 12,
            }}
          >
            {JSON.stringify(states, null, 2)}
          </pre>
        )}
      </FieldsListener>

      <Spacer height={8} />

      <form
        onSubmit={onSubmit}
        onReset={() => {
          resetForm();
        }}
      >
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
