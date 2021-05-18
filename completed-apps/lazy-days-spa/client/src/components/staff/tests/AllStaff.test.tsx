/* eslint-disable no-console */
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { QueryClientProvider, setLogger } from 'react-query';

import { server } from '../../../mocks/server';
import { generateQueryClient } from '../../../react-query/queryClient';
import { renderWithQueryClient } from '../../../test-utils';
import { AllStaff } from '../AllStaff';

test('renders response from query', async () => {
  renderWithQueryClient(<AllStaff />);
  const staffNames = await screen.findAllByRole('heading', {
    name: /divya|sandra|michael|mateo/i,
  });

  expect(staffNames).toHaveLength(4);
});

// as an exercise, this next test is done without test-utils
test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff
  server.resetHandlers(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  // suppress errors
  setLogger({
    log: console.log,
    warn: console.warn,
    error: () => {
      // swallow errors without printing out
    },
  });

  // set up query client with retries set to false
  const queryClient = generateQueryClient();
  const options = queryClient.getDefaultOptions();
  options.queries = { ...options.queries, retry: false };
  queryClient.setDefaultOptions(options);

  // render wrapped with provider
  render(
    <QueryClientProvider client={queryClient}>
      <AllStaff />
    </QueryClientProvider>,
  );

  // check for the toast alert
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
