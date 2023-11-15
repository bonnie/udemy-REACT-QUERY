// https://tanstack.com/query/latest/docs/react/guides/testing
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderResult } from "@testing-library/react";
import { ReactElement } from "react";

import {
  generateQueryClient,
  queryClientConfig,
} from "../react-query/queryClient";

// make this a function for unique queryClient per test
const generateTestQueryClient = () => {
  const testConfig = queryClientConfig;
  testConfig.defaultOptions.queries.retry = false;
  testConfig.defaultOptions.mutations.retry = false;
  return generateQueryClient(testConfig);
};

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient
): RenderResult {
  const queryClient = client ?? generateTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateTestQueryClient();
  return ({ children }: React.PropsWithChildren<object>) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
