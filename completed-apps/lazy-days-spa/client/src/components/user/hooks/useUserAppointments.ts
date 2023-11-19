import { useQuery } from "@tanstack/react-query";

import type { Appointment, User } from "@shared/types";

import { useUser } from "./useUser";

import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { generateUserAppointmentsKey } from "@/react-query/key-factories";

// query function
async function getUserAppointments(
  user: User | null
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user.token),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { user } = useUser();

  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery({
    enabled: !!user,
    queryKey: generateUserAppointmentsKey(user),
    queryFn: () => getUserAppointments(user),
  });

  return userAppointments;
}
