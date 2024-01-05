import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const queryClient = useQueryClient();
  const { userId } = useLoginData();

  const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({ title: "You have reserved an appointment!", status: "success" });
    },
  });

  return mutate;
}
