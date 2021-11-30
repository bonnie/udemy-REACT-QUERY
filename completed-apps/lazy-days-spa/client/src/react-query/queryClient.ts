import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

const toast = createStandaloneToast();

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export const defaultQueryClientOptions = {
  queries: {
    onError: queryErrorHandler,
    staleTime: 600000, // 10 minutes
    cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  mutations: {
    onError: queryErrorHandler,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions,
});
