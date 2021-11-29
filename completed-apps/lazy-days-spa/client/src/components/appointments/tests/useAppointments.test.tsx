import { act, renderHook } from '@testing-library/react-hooks';

import { createWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';

test('reserve mutation', async () => {
  const { result, waitFor } = renderHook(() => useAppointments(), {
    wrapper: createWrapper(),
  });

  // to get your bearings
  // console.log(result);
  // console.log(result.current);

  // wait for the appointments to populate
  await waitFor(() => Object.keys(result.current.appointments).length > 0);

  const filteredAppointmentLength = Object.keys(result.current.appointments)
    .length;

  // set to filter to all appointments
  // should show at least one more appointment (the one that was "taken")
  // might show more depending on what day of the month test is run on!
  act(() => result.current.setShowAll(true));

  // wait for the appointments to show more than when filtered
  await waitFor(
    () =>
      Object.keys(result.current.appointments).length >
      filteredAppointmentLength,
  );
});
