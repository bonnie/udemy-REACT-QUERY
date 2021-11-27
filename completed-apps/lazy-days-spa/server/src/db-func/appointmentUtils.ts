/* eslint-disable no-plusplus */
/* eslint-disable max-lines-per-function */
import dayjs from 'dayjs';

import { Appointment } from '../../../shared/types';
import db from '.';

// utility function to make unpadded month/date numbers into padded
function padNum(num: number | string): string {
  return num.toString().length === 1 ? `0${num}` : num.toString();
}

// utility function to make appointment from date and treatment type
function makeAppointment(
  treatmentName: string,
  dateTime: dayjs.Dayjs,
  existingAppointmentsById: Record<number, Appointment>,
): Appointment {
  const id = Number(dayjs(dateTime).unix());

  // if the appointment is filled, don't make the recurring appointment
  if (existingAppointmentsById[id]) return existingAppointmentsById[id];

  // otherwise, make the recurring appointment
  const appointment: Appointment = {
    id,
    dateTime: dateTime.toDate(),
    treatmentName,
  };

  // assign some appointments as filled by nonexistent "user 100" based on datetime mod
  if (Math.floor(Math.random() * 10) % 3 === 0) appointment.userId = 100;

  return appointment;
}

// generate an appointments object with recurring appointments and add to db
// (if not already there)
// Meant to be run on server startup
export async function createAppointments(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Creating appointments...');
  const existingAppointments = await db.getAppointments();

  // make a map of appointments by id for easy access;
  const existingAppointmentsById = {};
  existingAppointments.forEach((a) => {
    existingAppointmentsById[a.id] = a;
  });

  const allAppointments: Appointment[] = [];

  // start with today
  const month = dayjs().month();
  const year = dayjs().year();

  // do this for three months; dayjs 0-indexes its months, hence starting at 1
  for (let monthsFromNow = 1; monthsFromNow < 4; monthsFromNow++) {
    // make sure month is two digits;
    const monthString = padNum(month + monthsFromNow);
    const startDate = dayjs(`${year}${monthString}01`);
    const lastDate = Number(startDate.endOf('month').format('DD'));

    for (let i = 0; i < lastDate; i++) {
      const dayNum = i + 1;
      const thisDate = dayjs(`${year}${monthString}${padNum(dayNum)}`);
      const dayofWeek = Number(thisDate.format('d'));
      switch (dayofWeek) {
        case 1:
          // Mondays: massage 10am, facial 2pm
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(10, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'facial',
              thisDate.clone().add(14, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 2:
          // Tuesdays: scrub 1pm, massage 3pm
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(15, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 3:
          // Wednesdays: facial: 11am, scrub 4pm
          allAppointments.push(
            makeAppointment(
              'facial',
              thisDate.clone().add(11, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(16, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 4:
          // Thursdays: scrub: 9am, scrub 1pm
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(9, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 5:
          // Fridays: massage: 1pm, massage 3pm
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(15, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        default:
          break;
      }
    }
  }
  await db.writeAppointments(allAppointments);
}
