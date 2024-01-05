/* eslint-disable no-console */

import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

import { generateQueryClient } from '../react-query/queryClient';

// suppress errors written to console
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // swallow the errors
  },
});

// make this a function for unique queryClient per test
const generateTestQueryClient = () => {
  const client = generateQueryClient();
  const options = client.getDefaultOptions();
  options.queries = { ...options.queries, retry: false };
  return client;
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
export const createQueryClientWrapper = (): React.FC => {
  const queryClient = generateTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
