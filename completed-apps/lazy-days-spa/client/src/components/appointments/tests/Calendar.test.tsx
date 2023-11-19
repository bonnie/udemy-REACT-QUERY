import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { Calendar } from "../Calendar";

import { server } from "@/mocks/server";
import { renderWithQueryClient } from "@/test-utils";

test("Appointment query error", async () => {
  // (re)set handler to return a 500 error for appointments
  server.resetHandlers(
    http.get("http://localhost:3030/appointments/:month/:year", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  renderWithQueryClient(<Calendar />);

  // account for race condition where some machines might
  // run the query after one toast appears, where others might run after both
  // see https://www.udemy.com/course/learn-react-query/learn/#questions/18639906/
  //
  // wait until there are two alerts, one from fetch and one from pre-fetch
  await waitFor(() => {
    const alertToasts = screen.getAllByRole("alert");
    expect(alertToasts).toHaveLength(2);
    alertToasts.map((toast) =>
      expect(toast).toHaveTextContent("Request failed with status code 500")
    );
  });
});
