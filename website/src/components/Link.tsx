import { useTheme } from "@chakra-ui/system";
import * as React from "react";
import { Link as WouterLink, LinkProps, useRoute } from "wouter";

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
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        ...(active && {
          backgroundColor: colors.green[100],
          color: colors.green[700],
        }),
      }}
    />
  );
};
