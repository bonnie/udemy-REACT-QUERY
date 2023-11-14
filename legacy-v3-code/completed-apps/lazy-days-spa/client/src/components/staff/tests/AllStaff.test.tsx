/* eslint-disable no-console */

import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { DefaultOptions, setLogger } from 'react-query';

import { server } from '../../../mocks/server';
import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { renderWithQueryClient } from '../../../test-utils';
import { AllStaff } from '../AllStaff';

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // swallow the errors
  },
});

test('renders response from query', async () => {
  renderWithQueryClient(<AllStaff />);

  const staffNames = await screen.findAllByRole('heading', {
    name: /divya|sandra|michael|mateo/i,
  });
  expect(staffNames).toHaveLength(4);
});

test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff and treatments
  server.resetHandlers(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
    rest.get('http://localhost:3030/treatments', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const defaultOptions: DefaultOptions = defaultQueryClientOptions;
  if (defaultOptions && defaultOptions.queries)
    defaultOptions.queries.retry = false;

  renderWithQueryClient(<AllStaff />);

  // check for the toast alert
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
