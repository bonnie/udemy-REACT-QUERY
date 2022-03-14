/* eslint-disable no-console */
import { screen } from '@testing-library/react';
import { rest } from 'msw';

import { server } from '../../../mocks/server';
import { renderWithQueryClient } from '../../../test-utils';
import { Calendar } from '../Calendar';

test('Appointment query error', async () => {
  // (re)set handler to return a 500 error for appointments
  server.resetHandlers(
    rest.get(
      'http://localhost:3030/appointments/:month/:year',
      (req, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );

  renderWithQueryClient(<Calendar />);

  // check for the toast alert
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
