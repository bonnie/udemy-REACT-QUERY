import { useQuery } from "@tanstack/react-query";

import type { Appointment } from "@shared/types";

import { useUser } from "./useUser";

import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { generateUserAppointmentsKey } from "@/react-query/key-factories";

// query function
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { user } = useUser();
  const userId = user?.id;
  const userToken = user?.token;

  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery({
    enabled: !!userId,
    queryKey: generateUserAppointmentsKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
  });

  return userAppointments;
}
