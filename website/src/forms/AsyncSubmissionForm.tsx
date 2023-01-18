import { Button } from "@chakra-ui/button";
import { HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";
import { Input } from "../components/Input";
import { Page } from "../components/Page";
import { resolveAfter } from "../utils/promises";

export const AsyncSubmissionForm = () => {
  const { Field, resetForm, submitForm, formStatus } = useForm({
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

  return (
    <Page
      title="Async submission"
      description="Even if we do not recommend preventing the submission of the form until all the values in it are valid (which is a bad UX practice), the library still handle async submission just fine 🔥."
    >
      <form
        onSubmit={onSubmit}
        onReset={() => {
          resetForm();
        }}
      >
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

          <Button
            colorScheme="green"
            type="submit"
            width={100}
            disabled={formStatus === "submitting"}
            isLoading={formStatus === "submitting"}
          >
            Submit
          </Button>
        </HStack>
      </form>
    </Page>
  );
};
