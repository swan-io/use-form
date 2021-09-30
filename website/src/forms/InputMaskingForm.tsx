import { Button } from "@chakra-ui/button";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { HStack, Spacer } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import cardValidator from "card-validator";
import * as React from "react";
import { useForm } from "react-ux-form";
import { Rifm } from "rifm";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

const formatCardNumber = (string: string) => {
  const digits = (string.match(/\d+/g) || []).join("");
  const chars = digits.split("");

  const res = chars
    .reduce(
      (acc, char, index) => ([4, 8, 12, 16].includes(index) ? `${acc} ${char}` : `${acc}${char}`),
      "",
    )
    .substr(0, 19);

  return string.endsWith(" ") && [4, 9, 14, 19].includes(res.length) ? `${res} ` : res;
};

const appendSpace = (res: string) => ([4, 9, 14].includes(res.length) ? `${res} ` : res);

export const InputMaskingForm = () => {
  const { Field, resetForm, submitForm } = useForm({
    cardNumber: {
      strategy: "onSuccessOrBlur",
      initialValue: "",
      sanitize: (value) => value.trim(),
      validate: (value) => {
        if (!cardValidator.number(value).isValid) {
          return "Card number is invalid";
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
      title="Input masking"
      description={
        <>
          You can try it by yourself using random credit card numbers from{" "}
          <Link
            href="https://www.creditcardvalidator.org/generator"
            isExternal={true}
            color="gray.600"
            fontWeight="medium"
          >
            creditcardvalidator.org <ExternalLinkIcon marginTop={-1} />
          </Link>
          <br />
          Validation is performed using{" "}
          <Link
            href="https://www.npmjs.com/package/card-validator"
            isExternal={true}
            color="gray.600"
            fontWeight="medium"
          >
            card-validator <ExternalLinkIcon marginTop={-1} />
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Field name="cardNumber">
          {({ error, onBlur, onChange, ref, valid, validating, value }) => (
            <Rifm
              accept={/\d+/g}
              mask={19 <= value.length}
              format={formatCardNumber}
              value={value}
              onChange={onChange}
              append={appendSpace}
            >
              {({ value, onChange }) => (
                <Input
                  label="Card number"
                  validation="Must be valid"
                  placeholder="4242 4242 4242 4242"
                  strategy="onSuccessOrBlur"
                  error={error}
                  onBlur={onBlur}
                  onChange={onChange}
                  ref={ref}
                  valid={valid}
                  validating={validating}
                  value={value}
                />
              )}
            </Rifm>
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
