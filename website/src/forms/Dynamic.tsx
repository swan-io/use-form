import { Button } from "@chakra-ui/button";
import { HStack, Spacer } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useForm } from "@swan-io/use-form";
import * as React from "react";
import { Input } from "../components/Input";
import { Page } from "../components/Page";

export const Dynamic = () => {
  const [fields, setFields] = React.useState<{ key: string; name: string }[]>([]);

  const config = React.useMemo(
    () =>
      Object.fromEntries(
        fields.map((item) => [
          item.key,
          {
            strategy: "onBlur" as const,
            initialValue: "",
            sanitize: (value: string) => value.trim(),
            validate: (value: string) => {
              if (value === "") {
                return "First name is required";
              }
            },
          },
        ]),
      ),
    [fields],
  );

  const { Field, resetForm, submitForm } = useForm(config);

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
      title="Basic"
      description={
        <>
          A common form example which play with at least two different strategies.
          <br />
          Note that all values are sanitized using trimming.
        </>
      }
    >
      <HStack justifyContent="flex-start" spacing={3}>
        <Button
          width={100}
          onClick={() =>
            setFields((fields) => [
              ...fields,
              { key: crypto.randomUUID(), name: `Field ${fields.length}` },
            ])
          }
        >
          Add field
        </Button>
        <Button width={140} onClick={() => setFields((fields) => fields.slice(0, -1))}>
          Remove field
        </Button>
      </HStack>

      <Spacer height={8} />

      <form
        onSubmit={onSubmit}
        onReset={() => {
          resetForm();
        }}
      >
        {fields.map((field) => (
          <Field name={field.key} key={field.key}>
            {({ error, onBlur, onChange, ref, valid, value }) => (
              <Input
                label={field.name}
                validation="Required"
                strategy="onBlur"
                error={error}
                onBlur={onBlur}
                onChangeText={onChange}
                ref={ref}
                valid={valid}
                value={value}
              />
            )}
          </Field>
        ))}

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
