import axios, { AxiosResponse } from "axios";

import { axiosInstance } from "@src/axiosInstance";
import { useCustomToast } from "@src/components/app/hooks/useCustomToast";
import { useUser } from "@src/components/user/hooks/useUser";
import { User } from "@shared/types";

interface UseAuth {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
}

type UserResponse = { user: User };
type ErrorResponse = { message: string };
type AuthResponseType = UserResponse | ErrorResponse;

export function useAuth(): UseAuth {
  const { updateUserData, clearUserData } = useUser();

  const SERVER_ERROR = "There was an error contacting the server.";
  const toast = useCustomToast();

  async function authServerCall(
    urlEndpoint: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const { data, status }: AxiosResponse<AuthResponseType> =
        await axiosInstance({
          url: urlEndpoint,
          method: "POST",
          data: { email, password },
          headers: { "Content-Type": "application/json" },
        });

      if (status === 400) {
        const title = "message" in data ? data.message : "Unauthorized";
        toast({ title, status: "warning" });
        return;
      }

      if ("user" in data && "token" in data.user) {
        toast({
          title: `Logged in as ${data.user.email}`,
          status: "info",
        });

        // update stored user data
        updateUserData(data.user);
      }
    } catch (errorResponse) {
      const title =
        axios.isAxiosError(errorResponse) &&
        errorResponse?.response?.data?.message
          ? errorResponse?.response?.data?.message
          : SERVER_ERROR;
      toast({
        title,
        status: "error",
      });
    }
  }

  async function signin(email: string, password: string): Promise<void> {
    authServerCall("/signin", email, password);
  }
  async function signup(email: string, password: string): Promise<void> {
    authServerCall("/user", email, password);
  }

  function signout(): void {
    // clear user from stored user data
    clearUserData();
    toast({
      title: "Logged out!",
      status: "info",
    });
  }

  // Return the user object and auth methods
  return {
    signin,
    signup,
    signout,
  };
}
