import { ChakraProvider } from "@chakra-ui/react";
import { App } from "components/app/App";
import React from "react";
import ReactDOM from "react-dom/client";

import { theme } from "./theme";
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
}
