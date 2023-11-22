import dayjs from "dayjs";

import type { Appointment, User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
// async function getUserAppointments(
//   userId: number,
//   userToken: string
// ): Promise<Appointment[] | null> {
//   const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
//     headers: getJWTHeader(userToken),
//   });
//   return data.appointments;
// }

export function useUserAppointments(): Appointment[] {
  // TODO replace with React Query
  return [];
}
