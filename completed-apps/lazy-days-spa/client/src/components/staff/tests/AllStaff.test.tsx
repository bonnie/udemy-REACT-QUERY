import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "@src/mocks/server";
import { renderWithQueryClient } from "@src/test-utils";

import { AllStaff } from "../AllStaff";

test("renders response from query", async () => {
  renderWithQueryClient(<AllStaff />);

  const staffNames = await screen.findAllByRole("heading", {
    name: /divya|sandra|michael|mateo/i,
  });
  expect(staffNames).toHaveLength(4);
});

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff and treatments
  server.resetHandlers(
    http.get("http://localhost:3030/staff", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/treatments", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  renderWithQueryClient(<AllStaff />);

  // check for the toast alert
  const alertToast = await screen.findByRole("alert");
  expect(alertToast).toHaveTextContent("Request failed with status code 500");
});
