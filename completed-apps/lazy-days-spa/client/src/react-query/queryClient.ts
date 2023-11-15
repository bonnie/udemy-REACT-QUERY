import { QueryCache, QueryClient } from "@tanstack/react-query";

import { toast } from "../components/app/toast";

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : "error connecting to server";
  toast({ title, status: "error", variant: "subtle", isClosable: true });
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
});
