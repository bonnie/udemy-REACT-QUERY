import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

export const PATCH_USER_MUTATION_KEY = "patch-user";

import type { User } from "@shared/types";

import { useUser } from "./useUser";

import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when we need a server function
async function patchUserOnServer(
  newData: User,
  originalData: User
): Promise<User> {
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // reference: https://tanstack.com/query/v5/docs/react/guides/optimistic-updates#via-the-ui
  const { mutate: patchUser } = useMutation({
    mutationFn: (newUserData: User) => patchUserOnServer(newUserData, user),
    mutationKey: [PATCH_USER_MUTATION_KEY],

    onSuccess: (userData: User | null) => {
      // show a toast if the mutation was successful
      if (userData) {
        toast({
          title: "User updated!",
          status: "success",
        });
      }
    },
    onSettled: async () => {
      // invalidate user query to make sure we're in sync with server data

      // make sure to _return_ the Promise from the query invalidation
      // so that the mutation stays in `pending` state until the refetch is finished
      // https://tanstack.com/query/v5/docs/react/guides/optimistic-updates#via-the-ui
      return await queryClient.invalidateQueries({
        queryKey: [queryKeys.user],
      });
    },
  });

  return patchUser;
}
