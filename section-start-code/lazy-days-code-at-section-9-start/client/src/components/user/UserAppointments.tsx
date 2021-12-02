import {
  Box,
  Center,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { ReactElement } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { Link } from 'react-router-dom';

import type { Appointment } from '../../../../shared/types';
import { useCancelAppointment } from '../appointments/hooks/useCancelAppointment';
import { useUser } from './hooks/useUser';
import { useUserAppointments } from './hooks/useUserAppointments';

interface AppointmentsTableProps {
  userAppointments: Appointment[];
}

function AppointmentsTable({
  userAppointments,
}: AppointmentsTableProps): ReactElement {
  const cancelAppointment = useCancelAppointment();

  return (
    <Table variant="simple" m={10} maxWidth="500px">
      <Tbody>
        {userAppointments.map((appointment) => (
          <Tr key={appointment.id}>
            <Td>
              <Text>{dayjs(appointment.dateTime).format('MMM D')}</Text>
            </Td>
            <Td>
              <Text>{dayjs(appointment.dateTime).format('h a')}</Text>
            </Td>
            <Td>
              <Text>{appointment.treatmentName}</Text>
            </Td>
            <Td>
              <IconButton
                aria-label="cancel appointment"
                onClick={() => {
                  cancelAppointment(appointment);
                }}
                icon={<ImCancelCircle />}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export function UserAppointments(): ReactElement | null {
  const { user } = useUser();
  const userAppointments = useUserAppointments();

  if (!user) {
    // don't render if there's no user
    return null;
  }

  return (
    <Box>
      <Heading mt={10} align="center">
        Your Appointments
      </Heading>
      <Center>
        {userAppointments.length > 0 ? (
          <AppointmentsTable userAppointments={userAppointments} />
        ) : (
          <Link to="/Calendar">Book an appointment</Link>
        )}
      </Center>
    </Box>
  );
}
