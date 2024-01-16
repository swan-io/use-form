import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex, Text, VStack } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import * as React from "react";
import { P, match } from "ts-pattern";
import { Link } from "./components/Link";
import { Page } from "./components/Page";
import { AsyncSubmissionForm } from "./forms/AsyncSubmissionForm";
import { BasicForm } from "./forms/BasicForm";
import { CheckboxesForm } from "./forms/CheckboxesForm";
import { CreditCardForm } from "./forms/CreditCardForm";
import { FieldsListenerForm } from "./forms/FieldsListenerForm";
import { IBANForm } from "./forms/IBANForm";
import { InputMaskingForm } from "./forms/InputMaskingForm";
import { StrategiesForm } from "./forms/StrategiesForm";
import { Router, routes } from "./utils/router";

export const App = () => {
  const route = Router.useRoute(routes);
  const isDesktop = !useBreakpointValue({ base: true, md: false });
  const { isOpen, onToggle, onClose } = useDisclosure();

  const pathKey = route?.key.split("-")[0];
  React.useEffect(onClose, [pathKey]);

  return (
    <Flex flex={1} flexDirection={{ base: "column-reverse", md: "row" }}>
      <Button
        borderRadius={0}
        display={{ base: "flex", md: "none" }}
        flexShrink={0}
        fontSize={14}
        height="48px"
        onClick={onToggle}
      >
        <HamburgerIcon height={5} width={5} marginRight={2} />
        MENU
      </Button>

      {(isDesktop || isOpen) && (
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
          borderTopWidth={{ base: 1, md: 0 }}
          borderRightWidth={{ base: 0, md: 1 }}
          flexShrink={0}
          height={{ base: "40%", md: "auto" }}
          width={{ base: "auto", md: 320 }}
        >
          <Text
            color="gray.500"
            fontSize={12}
            fontWeight={600}
            marginLeft={3}
            marginBottom={3}
            textTransform="uppercase"
          >
            Examples
          </Text>

          <VStack align="initial" spacing={1}>
            <Link to={Router.Home()}>Basic</Link>
            <Link to={Router.Strategies()}>Validation strategies</Link>
            <Link to={Router.FieldsListener()}>Fields listener</Link>
            <Link to={Router.AsyncSubmission()}>Async submission</Link>
            <Link to={Router.Checkboxes()}>Checkboxes</Link>
            <Link to={Router.IBAN()}>IBAN</Link>
            <Link to={Router.CreditCard()}>Credit card</Link>
            <Link to={Router.InputMasking()}>Input masking</Link>
          </VStack>
        </Flex>
      )}

      {match(route)
        .with({ name: "Home" }, () => <BasicForm />)
        .with({ name: "Strategies" }, () => <StrategiesForm />)
        .with({ name: "FieldsListener" }, () => <FieldsListenerForm />)
        .with({ name: "AsyncSubmission" }, () => <AsyncSubmissionForm />)
        .with({ name: "Checkboxes" }, () => <CheckboxesForm />)
        .with({ name: "IBAN" }, () => <IBANForm />)
        .with({ name: "CreditCard" }, () => <CreditCardForm />)
        .with({ name: "InputMasking" }, () => <InputMaskingForm />)
        .with(P.nullish, () => <Page title="Not found" />)
        .exhaustive()}
    </Flex>
  );
};
