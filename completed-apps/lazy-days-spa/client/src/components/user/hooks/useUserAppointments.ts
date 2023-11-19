import { useQuery } from "@tanstack/react-query";

import { axiosInstance, getJWTHeader } from "@src/axiosInstance";
import { generateUserAppointmentsKey } from "@src/react-query/key-factories";
import type { Appointment, User } from "@shared/types";

import { useUser } from "./useUser";

// query function
async function getUserAppointments(
  user: User | null
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
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
