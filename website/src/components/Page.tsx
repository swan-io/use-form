import { Flex, Heading, Spacer, Text } from "@chakra-ui/layout";
import * as React from "react";

export const Page = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
}) => (
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
    <main style={{ maxWidth: 768 }}>
      <Heading>{title}</Heading>

      {description ? (
        <>
          <Spacer height={4} />
          <Text color="gray.500">{description}</Text>
          <Spacer height={12} />
        </>
      ) : (
        <Spacer height={8} />
      )}

      {children}
    </main>
  </Flex>
);
