import { createBrowserRouter } from "react-router-dom";

import { Calendar } from "../appointments/Calendar";
import { AllStaff } from "../staff/AllStaff";
import { Treatments } from "../treatments/Treatments";
import { Signin } from "../user/Signin";
import { UserProfile } from "../user/UserProfile";
import { Home } from "./Home";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Staff", element: <AllStaff /> },
  { path: "/Calendar", element: <Calendar /> },
  { path: "/Treatments", element: <Treatments /> },
  { path: "/signin", element: <Signin /> },
  { path: "/user/:id", element: <UserProfile /> },
]);
