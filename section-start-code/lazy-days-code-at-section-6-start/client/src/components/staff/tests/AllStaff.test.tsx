import { screen } from "@testing-library/react";

// import { http, HttpResponse } from "msw";
// import { server } from '@/mocks/server';
// import { renderWithClient } from '@/test-utils';
import { AllStaff } from "../AllStaff";

test("renders response from query", () => {
  // write test here
});

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff and treatments
  // server.resetHandlers(
  // http.get("http://localhost:3030/staff", () => {
  //   return new HttpResponse(null, { status: 500 });
  // }),
  // http.get("http://localhost:3030/treatments", () => {
  //   return new HttpResponse(null, { status: 500 });
  // })
  // );
});
