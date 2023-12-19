import { http, HttpResponse } from "msw";

import {
  mockAppointments,
  mockStaff,
  mockTreatments,
  mockUserAppointments,
} from "./mockData";

export const handlers = [
  http.get("http://localhost:3030/treatments", () => {
    return HttpResponse.json(mockTreatments);
  }),
  http.get("http://localhost:3030/staff", () => {
    return HttpResponse.json(mockStaff);
  }),
  http.get("http://localhost:3030/appointments/:year/:month", () => {
    return HttpResponse.json(mockAppointments);
  }),
  http.get("http://localhost:3030/user/:id/appointments", () => {
    return HttpResponse.json({ appointments: mockUserAppointments });
  }),
  http.patch("http://localhost:3030/appointment/:id", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
