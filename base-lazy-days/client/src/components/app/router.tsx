import { createBrowserRouter } from "react-router-dom";

import { Calendar } from "@src/components/appointments/Calendar";
import { AllStaff } from "@src/components/staff/AllStaff";
import { Treatments } from "@src/components/treatments/Treatments";
import { Signin } from "@src/components/user/Signin";
import { UserProfile } from "@src/components/user/UserProfile";

import { Home } from "./Home";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Staff", element: <AllStaff /> },
  { path: "/Calendar", element: <Calendar /> },
  { path: "/Treatments", element: <Treatments /> },
  { path: "/signin", element: <Signin /> },
  { path: "/user/:id", element: <UserProfile /> },
]);
