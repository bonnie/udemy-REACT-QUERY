import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when server call is needed
// async function removeAppointmentUser(appointment: Appointment): Promise<void> {
//   const patchData = [{ op: 'remove', path: '/userId' }];
//   await axiosInstance.patch(`/appointment/${appointment.id}`, {
//     data: patchData,
//   });
// }

export function useCancelAppointment() {
  const toast = useCustomToast();

  // TODO: replace with mutate function
  return (appointment: Appointment) => {
    // nothing to see here
  };
}
