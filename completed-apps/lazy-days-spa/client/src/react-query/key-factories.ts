import { User } from "@shared/types";

import { queryKeys } from "./constants";

// use user instead of user.id to avoid react query dependencies linting error
export const generateUserKey = (user: User) => {
  return [queryKeys.user, user.id];
};

// use user instead of user.id to avoid react query dependencies linting error
export const generateUserAppointmentsKey = (user: User) => {
  return [queryKeys.appointments, queryKeys.user, user.id];
};
