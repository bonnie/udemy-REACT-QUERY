import { QueryCache, QueryClient } from "@tanstack/react-query";

import { toast } from "@/components/app/toast";

function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      gcTime: 900000, // 15 minutes
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
});
