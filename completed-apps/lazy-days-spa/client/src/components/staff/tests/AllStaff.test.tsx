import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { AllStaff } from "../AllStaff";

import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test-utils";

test("renders response from query", async () => {
  renderWithProviders(<AllStaff />);

  const staffNames = await screen.findAllByRole("heading", {
    name: /divya|sandra|michael|mateo/i,
  });
  expect(staffNames).toHaveLength(4);
});

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff and treatments
  server.use(
    http.get("http://localhost:3030/staff", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/treatments", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  renderWithProviders(<AllStaff />);

  // check for the toast alert
  const alertToast = await screen.findByRole("status");
  expect(alertToast).toHaveTextContent("Request failed with status code 500");
});
