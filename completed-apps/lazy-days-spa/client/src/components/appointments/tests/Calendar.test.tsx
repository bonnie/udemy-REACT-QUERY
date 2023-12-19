import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { Calendar } from "../Calendar";

import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test-utils";

test("Appointment query error", async () => {
  // (re)set handler to return a 500 error for appointments
  server.use(
    http.get("http://localhost:3030/appointments/:month/:year", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  renderWithProviders(<Calendar />);

  const alertToast = await screen.findByRole("status");
  expect(alertToast).toHaveTextContent("Request failed with status code 500");
});
