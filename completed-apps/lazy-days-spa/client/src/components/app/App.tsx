import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "../../react-query/queryClient";
import { theme } from "../../theme";
import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { router } from "./router";
import { ToastContainer } from "./toast";

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {" "}
        <Navbar />
        <Loading />
        <RouterProvider router={router} />
        <ToastContainer />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
