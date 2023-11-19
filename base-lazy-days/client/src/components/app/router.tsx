import { createBrowserRouter } from "react-router-dom";

import { Calendar } from "@/components/appointments/Calendar";
import { AllStaff } from "@/components/staff/AllStaff";
import { Treatments } from "@/components/treatments/Treatments";
import { Signin } from "@/components/user/Signin";
import { UserProfile } from "@/components/user/UserProfile";

import { Home } from "./Home";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Staff", element: <AllStaff /> },
  { path: "/Calendar", element: <Calendar /> },
  { path: "/Treatments", element: <Treatments /> },
  { path: "/signin", element: <Signin /> },
  { path: "/user/:id", element: <UserProfile /> },
]);
