import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@src/axiosInstance";
import { useCustomToast } from "@src/components/app/hooks/useCustomToast";
import { queryKeys } from "@src/react-query/constants";
import { Appointment } from "@shared/types";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: "remove", path: "/userId" }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: removeAppointmentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({
        title: "You have canceled the appointment!",
        status: "warning",
      });
    },
  });

  return mutate;
}
