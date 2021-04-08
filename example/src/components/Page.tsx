import { Box, Flex, Heading } from "@chakra-ui/layout";
import * as React from "react";

export const Page = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <Flex
    flexDirection="column"
    flexGrow={1}
    flexShrink={1}
    overflowY="scroll"
    paddingTop={{ base: 6, md: 8 }}
    paddingBottom={{ base: 6, md: 8 }}
    paddingLeft={{ base: 5, md: 10 }}
    paddingRight={{ base: 5, md: 10 }}
  >
    <main style={{ maxWidth: 500 }}>
      <Heading>{title}</Heading>
      <Box height={8} />
      {children}
    </main>
  </Flex>
);
