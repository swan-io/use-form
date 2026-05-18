import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Input as ChakraInput,
  Flex,
  FormLabel,
  InputGroup,
  InputProps,
  InputRightElement,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Strategy } from "@swan-io/use-form";
import * as React from "react";
import { useId } from "react";

type Props = {
  error?: string;
  label: string;
  onBlur: () => void;
  validation?: string;
  strategy: Strategy;
  placeholder?: string;
  onChange?: InputProps["onChange"];
  onChangeText?: (text: string) => void;
  valid: boolean;
  value: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      error,
      label,
      onBlur,
      validation,
      strategy,
      placeholder,
      onChange,
      onChangeText,
      valid,
      value,
    },
    forwardedRef,
  ) => {
    const id = useId();

    return (
      <Box>
        <FormLabel htmlFor={id} marginBottom={0}>
          {label}
        </FormLabel>

        <Flex flexDirection="row" marginBottom={2} alignItems="center">
          <Text color="gray.400" fontSize={14} fontWeight="medium">
            {validation}
          </Text>

          <Spacer width={2} />

          <Text color="gray.500" fontSize={12} fontWeight="medium">
            {strategy} ✨
          </Text>
        </Flex>

        <InputGroup>
          <ChakraInput
            id={id}
            ref={forwardedRef}
            onBlur={onBlur}
            placeholder={placeholder}
            value={value}
            isInvalid={error != null}
            onChange={(e) => {
              onChange?.(e);
              onChangeText?.(e.target.value);
            }}
          />

          {valid && (
            <InputRightElement>
              <CheckIcon color="green.500" />
            </InputRightElement>
          )}

          {error != null && (
            <InputRightElement>
              <WarningIcon color="red.500" />
            </InputRightElement>
          )}
        </InputGroup>

        <Box height={8}>
          <Spacer height={1} />

          {error != null && (
            <Text color="red.500" fontWeight={500} fontSize={14}>
              {error}
            </Text>
          )}
        </Box>
      </Box>
    );
  },
);
