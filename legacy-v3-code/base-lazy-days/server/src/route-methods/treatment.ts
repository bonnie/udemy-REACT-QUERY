import { Request, Response } from 'express';

import db from '../db-func';

export async function get(req: Request, res: Response): Promise<Response> {
  try {
    const treatments = await db.getTreatments();
    return res.status(200).json(treatments);
  } catch (e) {
    return res.status(500).json({ message: `could not get treatments: ${e}` });
  }
}

export default {
  get,
};
