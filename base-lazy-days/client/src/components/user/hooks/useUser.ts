import { useState } from 'react';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

// async function getUser(user: User | null): Promise<User | null> {
//   if (!user) return null;
//   const { data } = await axiosInstance.get(`/user/${user.id}`, {
//     headers: getJWTHeader(user),
//   });
//   return data.user;
// }

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const [user, setUser] = useState<User | null>(getStoredUser());

  // TODO: call useQuery to update user data from server

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // set user in state
    setUser(newUser);

    // update user in localstorage
    setStoredUser(newUser);

    // TODO: pre-populate user profile in React Query client
  }

  // meant to be called from useAuth
  function clearUser() {
    // update state
    setUser(null);

    // remove from localstorage
    clearStoredUser();

    // TODO: reset user to null in query client
  }

  return { user, updateUser, clearUser };
}
