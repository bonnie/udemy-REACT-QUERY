import { queryKeys } from "./constants";

// use user instead of user.id to avoid react query dependencies linting error
export const generateUserKey = (userId: number, userToken: string) => {
  return [queryKeys.user, userId, userToken];
};

// use user instead of user.id to avoid react query dependencies linting error
export const generateUserAppointmentsKey = (
  userId: number,
  userToken: string
) => {
  return [queryKeys.appointments, queryKeys.user, userId, userToken];
};
