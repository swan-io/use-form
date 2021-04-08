import { Box, Flex, Heading } from "@chakra-ui/layout";
import * as React from "react";

export const Page = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <Flex
    flexDirection="column"
    flexGrow={1}
    flexShrink={0}
    overflowY="scroll"
    paddingTop={8}
    paddingBottom={8}
    paddingLeft={10}
    paddingRight={10}
  >
    <main style={{ maxWidth: 500 }}>
      <Heading>{title}</Heading>
      <Box height={8} />
      {children}
    </main>
  </Flex>
);
