/* eslint-disable no-console */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

import { generateQueryClient } from '../react-query/queryClient';

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient
): RenderResult {
  const queryClient = client ?? generateQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = (): React.FC => {
  const queryClient = generateQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
