import { Request, Response } from 'express';

import { Appointment } from '../../../shared/types';
import db from '../db-func/index.js';

// month and year are required arguments
export async function get(req: Request, res: Response): Promise<Response> {
  const { month, year } = req.params;
  if (!month || !year) {
    return res
      .status(400)
      .json({ message: 'month and year are required to get appointments' });
  }
  try {
    const appointments = await db.getAppointmentsByMonthYear(
      Number(month),
      Number(year),
    );
    return res.status(200).json({ appointments });
  } catch (e) {
    return res.status(500).json({
      message: `could not get appointments for ${month} / ${year}: ${e}`,
    });
  }
}

export async function remove(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  try {
    await db.deleteItem<Appointment>(db.filenames.appointments, Number(id));
    return res.status(204);
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not delete appointment: ${e}` });
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { patch } = req.body;
    const updatedAppointment = await db.updateItem<Appointment>(
      Number(id),
      db.filenames.appointments,
      patch,
    );
    return res.status(200).json({ appointment: updatedAppointment });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not update appointment: ${e}` });
  }
}

export default {
  get,
  remove,
  update,
};
