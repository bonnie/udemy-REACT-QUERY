import {
  CloseAllToastsOptions,
  ToastId,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';

interface UseCustomToast {
  (options?: UseToastOptions | undefined): string | number | undefined;
  close: (id: ToastId) => void;
  closeAll: (options?: CloseAllToastsOptions | undefined) => void;
  update(id: ToastId, options): void;
  isActive: (id: ToastId) => boolean | undefined;
}

// a wrapper around Chakra UI's useToast that has my default options applied
export function useCustomToast(): UseCustomToast {
  return useToast({
    isClosable: true,
    variant: 'subtle',
    position: 'bottom',
  });
}
