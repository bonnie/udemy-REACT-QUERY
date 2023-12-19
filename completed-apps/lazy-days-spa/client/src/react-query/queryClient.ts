import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";

import { toast } from "@/components/app/toast";

function errorHandler(type: "query" | "mutation", errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = type === "query" ? "load" : "update";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      // default gcTime is 5 minutes, and it doesn't make sense for stale time
      //   to exceed gcTime
      gcTime: 1800000, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => errorHandler("query", error?.message),

    // onError: (error, query) =>
    //   errorHandler("query", error?.message, query.queryKey[0] as string),
  }),
  mutationCache: new MutationCache({
    onError: (error) => errorHandler("mutation", error?.message),
  }),
};

export function generateQueryClient(
  config: QueryClientConfig = queryClientConfig
) {
  return new QueryClient(config);
}

export const queryClient = generateQueryClient(queryClientConfig);
