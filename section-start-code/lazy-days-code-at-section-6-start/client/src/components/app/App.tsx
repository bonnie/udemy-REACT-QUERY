import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./Home";
import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { ToastContainer } from "./toast";

import { AuthContextProvider } from "@/auth/AuthContext";
import { Calendar } from "@/components/appointments/Calendar";
import { AllStaff } from "@/components/staff/AllStaff";
import { Treatments } from "@/components/treatments/Treatments";
import { Signin } from "@/components/user/Signin";
import { UserProfile } from "@/components/user/UserProfile";
import { queryClient } from "@/react-query/queryClient";
import { theme } from "@/theme";

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Loading />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Staff" element={<AllStaff />} />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/Treatments" element={<Treatments />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthContextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
