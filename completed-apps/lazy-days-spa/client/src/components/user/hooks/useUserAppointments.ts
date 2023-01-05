import { useQuery } from '@tanstack/react-query';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

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
    queryKey: [queryKeys.appointments, queryKeys.user, user],
    queryFn: () => getUserAppointments(user),
    enabled: !!user,
  });

  return userAppointments;
}
