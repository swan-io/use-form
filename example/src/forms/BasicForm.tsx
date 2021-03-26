import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import * as React from "react";
import { Page } from "../App";

export const BasicForm = () => {
  return (
    <Page title="Basic">
      <FormLabel>First name</FormLabel>
      <Input />

      <Box height={4} />

      <FormLabel>Last name</FormLabel>
      <Input />

      <Box height={8} />

      <Button alignSelf="flex-end" colorScheme="green">
        Submit
      </Button>
    </Page>
  );
};
