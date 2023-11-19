import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { PersistQueryClientProvider } from "@src/react-query/PersistQueryClientProvider";
import { theme } from "@src/theme";

import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { router } from "./router";
import { ToastContainer } from "./toast";

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <PersistQueryClientProvider>
        <Navbar />
        <Loading />
        <RouterProvider router={router} />
        <ToastContainer />
        <ReactQueryDevtools />
      </PersistQueryClientProvider>
    </ChakraProvider>
  );
}
