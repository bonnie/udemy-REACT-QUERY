// NOTE: in production this would connect to a database,
// not JSON files. However, I didn't want to make you install
// a particular database in order to use this app.
//
// This "database" is horribly inefficient and will be a problem
// when Lazy Days Spa opens to hundreds of locations globally.
import dayjs from 'dayjs';
import jsonPatch, { Operation } from 'fast-json-patch';
import { promises as fs } from 'fs';
import path from 'path';

import {
  Appointment,
  AppointmentDateMap,
  Staff,
  Treatment,
} from '../../../shared/types';
import { AuthUser, NewAuthUser } from '../auth';

type JsonDataType = AuthUser | Appointment | Treatment | Staff;

const dbPath = 'db';
export enum filenames {
  users = 'users.json',
  appointments = 'appointments.json',
  treatments = 'treatments.json',
  staff = 'staff.json',
}

/* ****** Read from file ***** */
async function getJSONfromFile<ItemType extends JsonDataType>(
  filename: filenames,
): Promise<ItemType[]> {
  const filePath = path.join(dbPath, filename);
  const data = await fs.readFile(filePath);
  return JSON.parse(data.toString());
}

/* ****** Write to file ***** */
async function writeJSONToFile<T extends JsonDataType>(
  filename: filenames,
  data: Array<T>,
): Promise<void> {
  const filePath = path.join(dbPath, filename);
  const jsonData = JSON.stringify(data);
  await fs.writeFile(filePath, jsonData, { flag: 'w' });
}

/* ****** Delete item ***** */
async function deleteItem<T extends JsonDataType>(
  filename: filenames,
  itemId: number,
): Promise<number> {
  try {
    const items = await getJSONfromFile<T>(filename);
    const foundItemArray = items.filter((i) => i.id === itemId);
    if (foundItemArray.length !== 1) {
      throw new Error(`Could not find item id ${itemId} in ${filename}`);
    }
    const updatedItems = items.filter((i) => i.id !== itemId);
    await writeJSONToFile(filename, updatedItems);
    return itemId;
  } catch (e) {
    throw new Error(
      `Could not delete item id ${itemId} from ${filename}: ${e}`,
    );
  }
}

/* ****** Update item ***** */
const { applyPatch } = jsonPatch;
// eslint-disable-next-line max-lines-per-function
async function updateItem<DataType extends JsonDataType>(
  itemId: number,
  filename: filenames,
  // should be fast-json-patch Operation, but I can't destructure on import
  itemPatch: Operation[],
): Promise<DataType> {
  try {
    const items = await getJSONfromFile<DataType>(filename);

    // find the item
    const foundItems = items.filter((item) => item.id === itemId);
    if (foundItems.length !== 1) {
      throw new Error(`Could not find item with id ${itemId}`);
    }

    // apply the patch
    const updatedData = applyPatch(foundItems[0], itemPatch).newDocument;

    // write the new item data. Note: this whole function is horribly inefficient and
    // would be much improved with a real db.
    items.forEach((item, i) => {
      if (item.id === itemId) {
        items[i] = updatedData;
      }
    });

    await writeJSONToFile(filename, items);
    return updatedData;
  } catch (e) {
    throw new Error(
      `Could not delete item id ${itemId} from ${filename}: ${e}`,
    );
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  return getJSONfromFile<Appointment>(filenames.appointments);
}

export async function getAppointmentsByMonthYear(
  month: string,
  year: string,
): Promise<AppointmentDateMap> {
  // yet another place where inefficiency is ridiculous compared to a real db
  const appointmentDateMap: AppointmentDateMap = {};
  const allAppointments = await getAppointments();

  // filter data and massage into format expected by client
  allAppointments.forEach((appointment) => {
    const appointmentDate = dayjs(appointment.dateTime);
    if (
      // zero-indexed month
      appointmentDate.month() + 1 === Number(month) &&
      appointmentDate.year() === Number(year)
    ) {
      const dayNum = dayjs(appointment.dateTime).date();
      if (appointmentDateMap[dayNum]) {
        appointmentDateMap[dayNum].push(appointment);
      } else {
        appointmentDateMap[dayNum] = [appointment];
      }
    }
  });
  return appointmentDateMap;
}

export async function getTreatments(): Promise<Treatment[]> {
  return getJSONfromFile<Treatment>(filenames.treatments);
}

export async function getStaff(): Promise<Staff[]> {
  return getJSONfromFile<Staff>(filenames.staff);
}

export function getUsers(): Promise<AuthUser[]> {
  return getJSONfromFile<AuthUser>(filenames.users);
}

export async function getUserById(userId: number): Promise<AuthUser> {
  const users = await getUsers();
  const userData = users.filter((u) => u.id === userId);
  if (userData.length < 1) throw new Error('user not found');
  if (userData.length < 1) throw new Error('duplicate user found');
  return userData[0];
}

/* ****** Add new user ***** */
async function addUser(newUserData: NewAuthUser): Promise<AuthUser> {
  const users = await getUsers();

  // get the max id from the existing ids
  const ids: number[] = Object.values(users).map((u) => u.id);
  const maxId = ids.reduce((tempMaxId: number, itemId: number) => {
    return itemId > tempMaxId ? itemId : tempMaxId;
  }, 0);

  // the new user will have an id of the max id plus 1
  const newUserId = maxId + 1;

  const newUser = { ...newUserData, id: newUserId };
  await writeJSONToFile(filenames.users, [...users, newUser]);
  return newUser;
}

/* ****** Add new appoinment ***** */
async function writeAppointments(
  newAppointmentsArray: Appointment[],
): Promise<void> {
  await writeJSONToFile(filenames.appointments, newAppointmentsArray);
}

export default {
  filenames,
  writeAppointments,
  addUser,
  deleteItem,
  updateItem,
  getUsers,
  getUserById,
  getAppointments,
  getAppointmentsByMonthYear,
  getStaff,
  getTreatments,
};
