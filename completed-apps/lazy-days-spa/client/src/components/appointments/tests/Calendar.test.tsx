/* eslint-disable no-console */
import { screen, waitFor } from '@testing-library/react';
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

  // account for race condition where some machines might
  // run the query after one toast appears, where others might run after both
  // see https://www.udemy.com/course/learn-react-query/learn/#questions/18639906/
  //
  // wait until there are two alerts, one from fetch and one from pre-fetch
  await waitFor(() => {
    const alertToasts = screen.getAllByRole('alert');
    expect(alertToasts).toHaveLength(2);
    alertToasts.map((toast) =>
      expect(toast).toHaveTextContent('Request failed with status code 500')
    );
  });
});
