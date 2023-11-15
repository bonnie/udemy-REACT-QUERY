import { RouterProvider } from "react-router-dom";

import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { router } from "./router";
import { ToastContainer } from "./toast";

export function App() {
  return (
    <>
      <Navbar />
      <Loading />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
