import { useToast } from "@chakra-ui/react";

// a wrapper around Chakra UI's useToast that has my default options applied
export function useCustomToast() {
  return useToast({
    isClosable: true,
    variant: "subtle",
    position: "bottom",
  });
}
