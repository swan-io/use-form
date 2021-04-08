import { Box, Flex, Text, VStack } from "@chakra-ui/layout";
import * as React from "react";
import { Route } from "wouter";
import { Link } from "./components/Link";
import { AsyncSubmissionForm } from "./forms/AsyncSubmissionForm";
import { AsyncValidationForm } from "./forms/AsyncValidationForm";
import { BasicForm } from "./forms/BasicForm";
import { CheckboxesForm } from "./forms/CheckboxesForm";
import { CreditCardForm } from "./forms/CreditCardForm";
import { IBANForm } from "./forms/IBANForm";
import { InputMaskingForm } from "./forms/InputMaskingForm";
import { StrategiesForm } from "./forms/StrategiesForm";

export const App = () => (
  <Flex flex={1} flexDirection={{ base: "column", md: "row" }}>
    <Flex
      backgroundColor="gray.50"
      flexDirection="column"
      overflowY="scroll"
      paddingTop={6}
      paddingBottom={6}
      paddingLeft={4}
      paddingRight={4}
      borderColor="gray.100"
      borderStyle="solid"
      borderBottomWidth={1}
      minHeight={{ base: 175, md: "auto" }}
      width={{ base: "auto", md: 300 }}
    >
      <Text
        color="gray.500"
        fontSize={12}
        fontWeight={600}
        marginLeft={3}
        textTransform="uppercase"
      >
        Examples
      </Text>

      <Box height={3} />

      <VStack align="initial" spacing={1}>
        <Link href="/">Basic</Link>
        <Link href="/strategies">Validation strategies</Link>
        <Link href="/async-validation">Async validation</Link>
        <Link href="/async-submission">Async submission</Link>
        <Link href="/checkboxes">Checkboxes</Link>
        <Link href="/iban">IBAN</Link>
        <Link href="/credit-card">Credit card</Link>
        <Link href="/input-masking">Input masking</Link>
      </VStack>
    </Flex>

    <Route path="/" component={BasicForm} />
    <Route path="/strategies" component={StrategiesForm} />
    <Route path="/async-validation" component={AsyncValidationForm} />
    <Route path="/async-submission" component={AsyncSubmissionForm} />
    <Route path="/checkboxes" component={CheckboxesForm} />
    <Route path="/iban" component={IBANForm} />
    <Route path="/credit-card" component={CreditCardForm} />
    <Route path="/input-masking" component={InputMaskingForm} />
  </Flex>
);
