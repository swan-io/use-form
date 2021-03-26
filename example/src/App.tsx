import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { useTheme } from "@chakra-ui/system";
import * as React from "react";
import { Link as WouterLink, LinkProps, Route, useRoute } from "wouter";
import { BasicForm } from "./forms/BasicForm";

export const Page = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <Flex
    flexDirection="column"
    flexGrow={1}
    flexShrink={0}
    overflowY="scroll"
    paddingBlock={8}
    paddingInline={10}
  >
    <main style={{ maxWidth: 500 }}>
      <Heading>{title}</Heading>
      <Box height={8} />
      <form>{children}</form>
    </main>
  </Flex>
);

export const Link = (props: LinkProps & { href: string }) => {
  const { colors } = useTheme();
  const [active] = useRoute(props.href);

  return (
    <WouterLink
      {...props}
      style={{
        borderRadius: 4,
        color: colors.gray[600],
        display: "flex",
        flexGrow: 1,
        fontWeight: 500,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 5,
        ...(active && {
          backgroundColor: colors.green[100],
          color: colors.green[700],
        }),
      }}
    />
  );
};

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
        marginLeft={2}
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
