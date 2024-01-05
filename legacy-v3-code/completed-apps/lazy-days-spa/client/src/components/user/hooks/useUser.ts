import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

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
  const { data: user } = useQuery<User>(
    queryKeys.user,
    ({ signal }) => getUser(user, signal),
    // ALTERNATE query function to maintain user after mutation
    // (see https://www.udemy.com/course/learn-react-query/learn/#questions/17098438/
    // for discussion)
    // ({ signal }) => {
    //   const storedUser = getStoredUser();
    //   const currentUser = user ?? storedUser;
    //   return getUser(currentUser, signal);
    // },
    {
      // populate initially with user in localStorage
      initialData: getStoredUser,

      // note: onSuccess is called on both successful query function completion
      //     *and* on queryClient.setQueryData
      // the `received` argument to onSuccess will be:
      //    - null, if this is called on queryClient.setQueryData in clearUser()
      //    - User, if this is called from queryClient.setQueryData in updateUser()
      //         *or* from the getUser query function call
      onSuccess: (received: null | User) => {
        if (!received) {
          clearStoredUser();
        } else {
          setStoredUser(received);
        }
      },
    }
  );

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update the user
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // reset user to null
    queryClient.setQueryData(queryKeys.user, null);

    // remove user appointments query
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
