import { Request, Response } from 'express';

import db from '../db-func';

export async function get(req: Request, res: Response): Promise<Response> {
  try {
    const staff = await db.getStaff();
    return res.status(200).json(staff);
  } catch (e) {
    return res.status(500).json({ message: `could not get staff: ${e}` });
  }
}

export default {
  get,
};
