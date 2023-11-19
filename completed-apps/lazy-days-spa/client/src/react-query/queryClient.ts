import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";

import { toast } from "@src/components/app/toast";

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : "error connecting to server";
  toast({ title, status: "error", variant: "subtle", isClosable: true });
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      // important for persistQueryClient
      // also, default gcTime is 5 minutes, and it doesn't make sense for stale time
      //   to exceed gcTime
      gcTime: 1800000, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: queryErrorHandler,
  }),
};

export function generateQueryClient(config: QueryClientConfig) {
  return new QueryClient(config);
}

export const queryClient = generateQueryClient(queryClientConfig);
