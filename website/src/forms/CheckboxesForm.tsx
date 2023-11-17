import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Code, HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import { Page } from "../components/Page";

export const CheckboxesForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    termsAndConditions: {
      strategy: "onChange",
      initialValue: false,
      validate: (value) => {
        if (!value) {
          return "You must accept terms and conditions";
        }
      },
    },
    emailsFromPartners: {
      strategy: "onChange",
      initialValue: false,
      validate: (value) => {
        if (!value) {
          return "You must accept to receive email from partners";
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
      title="Checkboxes"
      description={
        <>
          Checkboxes that must be ticked are a great use-case for <Code>onChange</Code> validation
          strategy.
        </>
      }
    >
      <form
        onSubmit={onSubmit}
        onReset={() => {
          resetForm();
        }}
      >
        <Field name="termsAndConditions">
          {({ error, onChange, value }) => (
            <Checkbox
              display="flex"
              isInvalid={error != null}
              isChecked={value}
              onChange={(e) => onChange(e.target.checked)}
              color="gray.600"
            >
              Accept terms and conditions
            </Checkbox>
          )}
        </Field>

        <Spacer height={1} />

        <Field name="emailsFromPartners">
          {({ error, onChange, value }) => (
            <Checkbox
              display="flex"
              isInvalid={error != null}
              isChecked={value}
              onChange={(e) => onChange(e.target.checked)}
              color="gray.600"
            >
              Receive emails from partners
            </Checkbox>
          )}
        </Field>

        <Spacer height={12} />

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
