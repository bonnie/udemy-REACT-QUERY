import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

// query function
async function getUser(
  user: User | null,
  signal: AbortSignal
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      signal, // abortSignal from React Query
      headers: getJWTHeader(user),
    }
  );

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();

  // call useQuery to update user data from server
  const { data: user } = useQuery<User>({
    // disabling exhaustive deps here since user is both the output of the useQuery function
    //   and a dependency, causing other linting issues.
    // for more information this aspect of the code, see this Q&A thread:
    //    https://www.udemy.com/course/learn-react-query/learn/#questions/17531882/
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [queryKeys.user],
    queryFn: ({ signal }) => getUser(user, signal),
    initialData: getStoredUser,
    onSuccess: (received: null | User) => {
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update the user
    queryClient.setQueryData([queryKeys.user], newUser);

    // With React Query v4, onSuccess is called only for a successful query function,
    //     not for queryClient.setQueryData. Reference:
    //     https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    setStoredUser(newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // reset user to null
    queryClient.setQueryData([queryKeys.user], null);

    // With React Query v4, onSuccess is called only for a successful query function,
    //     not for queryClient.setQueryData. Reference:
    //     https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    clearStoredUser();

    // remove user appointments query
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
