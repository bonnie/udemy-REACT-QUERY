// https://tanstack.com/query/latest/docs/react/guides/testing
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderResult } from "@testing-library/react";
import { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import {
  generateQueryClient,
  queryClientConfig,
} from "@/react-query/queryClient";

// make this a function to use within tests if you want to pre-populate cache
export const generateTestQueryClient = () => {
  const testConfig = queryClientConfig;
  testConfig.defaultOptions.queries.retry = false;
  return generateQueryClient(testConfig);
};

const defaultClient = generateTestQueryClient();

export function renderWithProviders(
  ui: ReactElement,
  client?: QueryClient
): RenderResult {
  defaultClient.clear();
  const queryClient = client ?? defaultClient;
  return render(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateTestQueryClient();
  return ({ children }: React.PropsWithChildren<object>) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
