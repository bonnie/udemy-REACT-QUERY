import { Request, Response } from 'express';

import { Appointment } from '../../../shared/types';
import db from '../db-func';

// month and year are required arguments
export async function get(req: Request, res: Response): Promise<Response> {
  const { month, year } = req.params;
  if (!month || !year) {
    return res
      .status(400)
      .json({ message: 'month and year are required to get appointments' });
  }
  try {
    const appointments = await db.getAppointmentsByMonthYear(month, year);
    return res.status(200).json(appointments);
  } catch (e) {
    return res.status(500).json({
      message: `could not get appointments for ${month} / ${year}: ${e}`,
    });
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const patch = req.body.data;
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
  update,
};
