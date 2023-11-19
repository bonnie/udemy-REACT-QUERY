import { screen } from "@testing-library/react";

// import { http, HttpResponse } from "msw";
// import { server } from '@/mocks/server';
// import { defaultQueryClientOptions } from '@/react-query/queryClient';
// import { renderWithClient } from '@/test-utils';
import { Calendar } from "../Calendar";

// mocking useUser to mimic a logged-in user
// jest.mock('../../user/hooks/useUser', () => ({
//   __esModule: true,
//   useUser: () => ({ user: mockUser }),
// }));

test("Reserve appointment error", () => {
  // (re)set handler to return a 500 error for appointments
  // server.resetHandlers(
  //   http.get("http://localhost:3030/appointments/:month/:year", () => {
  //     return new HttpResponse(null, { status: 500 });
  //   })
  // );
});
