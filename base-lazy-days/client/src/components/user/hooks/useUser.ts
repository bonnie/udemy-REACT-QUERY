import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

interface AxiosResponseWithCancel extends AxiosResponse {
  cancel: () => void;
}

async function getUser(user: User | null): Promise<AxiosResponse> {
  const source = axios.CancelToken.source();

  if (!user) return null;
  const axiosResponse: AxiosResponseWithCancel = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      cancelToken: source.token,
    },
  );

  axiosResponse.cancel = () => {
    source.cancel();
  };

  return axiosResponse;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const queryClient = useQueryClient();

  // TODO: call useQuery to update user data from server
  useQuery(queryKeys.user, () => getUser(user), {
    enabled: !!user,
    onSuccess: (axiosResponse) => setUser(axiosResponse?.data?.user),
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    setUser(newUser);
    setStoredUser(newUser);

    queryClient.setQueriesData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    setUser(null);
    clearStoredUser();

    queryClient.setQueriesData(queryKeys.user, null);

    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
