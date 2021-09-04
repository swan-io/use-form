import { Button } from "@chakra-ui/button";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { HStack, Spacer } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import * as React from "react";
import { useForm } from "react-ux-form";
import validator from "validator";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const IBANForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    iban: {
      strategy: "onFirstSuccessOrFirstBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!validator.isIBAN(value)) {
          return "Value is not a valid IBAN";
        }
      },
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
      title="IBAN"
      description={
        <>
          You can try it by yourself using random IBAN from{" "}
          <Link href="http://randomiban.com" isExternal={true} color="gray.600" fontWeight="medium">
            randomiban.com <ExternalLinkIcon marginTop={-1} />
          </Link>
          <br />
          Validation is performed using{" "}
          <Link
            href="https://www.npmjs.com/package/validator"
            isExternal={true}
            color="gray.600"
            fontWeight="medium"
          >
            validator <ExternalLinkIcon marginTop={-1} />
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Field name="iban">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Input
              label="IBAN"
              validation="Must be valid"
              placeholder="FR2230003000403598356122X09"
              strategy="onFirstSuccessOrFirstBlur"
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
