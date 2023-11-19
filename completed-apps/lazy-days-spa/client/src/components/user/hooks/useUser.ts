import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import {
  generateUserAppointmentsKey,
  generateUserKey,
} from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string, signal: AbortSignal) {
  // if (!userId) {
  //   return null;
  // }
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

  // try to get existing user from query cache
  //    this includes a persisted cache
  const cachedUsers = queryClient.getQueriesData({
    queryKey: [queryKeys.user],
  });

  // start off with null cached user -- this will remain the value if we got 0 or >1 users
  //     from the getQueriesData call
  // can't just do an early return bc that would conditionally call useQuery, which
  //    is against the rules of hooks!
  let cachedUser: User | null = null;

  // if there were multiple users, that's an unexpected result. Return null and clear the cache
  if (cachedUsers.length > 1) {
    queryClient.removeQueries({ queryKey: [queryKeys.user] });
  }

  // here's the only condition where user **won't** be null
  if (cachedUsers.length === 1) {
    // cachedUsers is an array of tuples (or one tuple if we made it to this point)
    // that looks like
    //  // array
    //  [
    //    // first and only tuple
    //    [
    //      // tuple contents
    //      [BASE_USER_KEY, userID], user
    //    ]
    //  ]
    // reference: https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientgetqueriesdata
    cachedUser = cachedUsers[0][1] as User;
  }

  const cachedUserId = cachedUser?.id;
  const cachedUserToken = cachedUser?.token;
  const cachedUserKey = generateUserKey(cachedUserId, cachedUserToken);

  // call useQuery to update user data from server
  const { data: user } = useQuery({
    // https://tanstack.com/query/v4/docs/react/guides/dependent-queries#usequery-dependent-query
    enabled: !!cachedUserId,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: cachedUserKey,
    queryFn: ({ signal }) => getUser(cachedUserId, cachedUserToken, signal),

    // populate initially with user in localStorage
    initialData: cachedUser,
  });

  // meant to be called from useAuth
  function updateUserData(newUser: User): void {
    // update the user
    queryClient.setQueryData(cachedUserKey, newUser);
  }

  // meant to be called from useAuth
  function clearUserData() {
    // reset user to null
    queryClient.removeQueries({
      queryKey: cachedUserKey,
    });

    // remove user appointments query
    queryClient.removeQueries({
      queryKey: generateUserAppointmentsKey(cachedUser),
    });
  }

  return { user, updateUserData, clearUserData };
}
