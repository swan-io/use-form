import { Box, Flex, Text, VStack } from "@chakra-ui/layout";
import * as React from "react";
import { Route } from "wouter";
import { Link } from "./components/Link";
import { BasicForm } from "./forms/BasicForm";

export const App = () => (
  <Flex flex={1} flexDirection="row">
    <Flex
      backgroundColor="gray.50"
      flexDirection="column"
      overflowY="scroll"
      paddingBlock={6}
      paddingInline={4}
      width={300}
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
        <Link href="/credit-card">Credit card</Link>
      </VStack>
    </Flex>

    <Route path="/" component={BasicForm} />
  </Flex>
);
