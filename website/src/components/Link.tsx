import { useTheme } from "@chakra-ui/system";
import { useLinkProps } from "@swan-io/chicane";
import * as React from "react";

export const Link = ({ to, children }: { to: string; children: string }) => {
  const { colors } = useTheme();
  const { active, onClick } = useLinkProps({ href: to });

  return (
    <a
      href={to}
      onClick={onClick}
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
    >
      {children}
    </a>
  );
};
