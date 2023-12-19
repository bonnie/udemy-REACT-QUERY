import { Box, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

import { Appointment as AppointmentType } from "@shared/types";

import { useReserveAppointment } from "./hooks/useReserveAppointment";
import { appointmentInPast, getAppointmentColor } from "./utils";

import { useLoginData } from "@/auth/AuthContext";

// determine whether this appointment can be reserved / un-reserved by logged-in user
function isClickable(
  userId: number | null,
  appointmentData: AppointmentType
): boolean {
  return !!(
    userId &&
    (!appointmentData.userId || appointmentData.userId === userId) &&
    !appointmentInPast(appointmentData)
  );
}

interface AppointmentProps {
  appointmentData: AppointmentType;
}

export function Appointment({ appointmentData }: AppointmentProps) {
  const { userId } = useLoginData();

  const reserveAppointment = useReserveAppointment();
  const [textColor, bgColor] = getAppointmentColor(appointmentData, userId);

  const clickable = isClickable(userId, appointmentData);
  let onAppointmentClick: undefined | (() => void);
  let hoverCss = {};

  // turn the lozenge into a button if it's clickable
  if (clickable) {
    onAppointmentClick = userId
      ? () => reserveAppointment(appointmentData)
      : undefined;
    hoverCss = {
      transform: "translateY(-1px)",
      boxShadow: "md",
      cursor: "pointer",
    };
  }

  const appointmentHour = dayjs(appointmentData.dateTime).format("h a");
  return (
    <Box
      borderRadius="lg"
      px={2}
      bgColor={bgColor}
      color={textColor}
      as={clickable ? "button" : "div"}
      onClick={onAppointmentClick}
      _hover={hoverCss}
    >
      <HStack justify="space-between">
        <Text as="span" fontSize="xs">
          {appointmentHour}
        </Text>
        <Text as="span" fontSize="xs">
          {appointmentData.treatmentName}
        </Text>
      </HStack>
    </Box>
  );
}
