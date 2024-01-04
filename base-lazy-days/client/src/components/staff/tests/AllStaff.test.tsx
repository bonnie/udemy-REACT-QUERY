import { screen } from "@testing-library/react";

import { AllStaff } from "../AllStaff";

// import { http, HttpResponse } from "msw";
// import { server } from '@/mocks/server';
// import { renderWithQueryClient } from "@/test-utils";

test("renders response from query", () => {
  // write test here
});

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff and treatments
  // server.use(
  // http.get("http://localhost:3030/staff", () => {
  //   return new HttpResponse(null, { status: 500 });
  // }),
  // http.get("http://localhost:3030/treatments", () => {
  //   return new HttpResponse(null, { status: 500 });
  // })
  // );
});
