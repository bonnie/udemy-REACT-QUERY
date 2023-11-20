import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { generateUserKey } from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string, signal: AbortSignal) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      signal, // abortSignal from React Query
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUserData: (user: User) => void;
  clearUserData: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  const { loginData } = useLoginData();

  // can't destructure since loginData might be null
  const userId = loginData?.userId;
  const userToken = loginData?.userToken;

  // call useQuery to update user data from server
  const { data: user } = useQuery({
    // https://tanstack.com/query/v4/docs/react/guides/dependent-queries#usequery-dependent-query
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: ({ signal }) => getUser(userId, userToken, signal),
  });

  // meant to be called from useAuth
  function updateUserData(newUser: User): void {
    // update the user in the cache
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUserData() {
    // remove user data
    queryClient.removeQueries({
      queryKey: [queryKeys.user],
    });

    // remove user appointments data
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUserData, clearUserData };
}
