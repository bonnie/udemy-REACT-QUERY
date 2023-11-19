import { axiosInstance } from "@src/axiosInstance";
import { useCustomToast } from "@src/components/app/hooks/useCustomToast";
import { useUser } from "@src/components/user/hooks/useUser";
import { queryKeys } from "@src/react-query/constants";
import { Appointment } from "@shared/types";

// for when we need functions for useMutation
// async function setAppointmentUser(
//   appointment: Appointment,
//   userId: number | undefined,
// ): Promise<void> {
//   if (!userId) return;
//   const patchOp = appointment.userId ? 'replace' : 'add';
//   const patchData = [{ op: patchOp, path: '/userId', value: userId }];
//   await axiosInstance.patch(`/appointment/${appointment.id}`, {
//     data: patchData,
//   });
// }

// TODO: update type for React Query mutate function
type AppointmentMutationFunction = (appointment: Appointment) => void;

export function useReserveAppointment(): AppointmentMutationFunction {
  const { user } = useUser();
  const toast = useCustomToast();

  // TODO: replace with mutate function
  return (appointment: Appointment) => {
    // nothing to see here
  };
}
