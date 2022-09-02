/* eslint-disable no-console */
import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';

const toast = createStandaloneToast();

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    // from https://tanstack.com/query/v4/docs/guides/testing#turn-off-network-error-logging
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: !(process.env.NODE_ENV === 'test'), // set retry to false for tests
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
}

export const queryClient = generateQueryClient();
