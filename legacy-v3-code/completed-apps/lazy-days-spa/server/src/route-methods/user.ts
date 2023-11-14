import { Request, Response } from 'express';

import { User } from '../../../shared/types';
import { AuthUser, createJWT, hashPassword, passwordIsValid } from '../auth';
import db from '../db-func';
import { AuthRequest } from '../middlewares';

function removePasswordandAddToken(user: AuthUser): User {
  // use "object rest operator" to remove properties in a typescript-friendly way
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { salt, keylen, iterations, hash, digest, ...cleanUser } = user;

  // create token
  const token = createJWT(cleanUser);

  // return user with token
  return { ...cleanUser, token };
}

// eslint-disable-next-line max-lines-per-function
export async function get(req: AuthRequest, res: Response): Promise<Response> {
  try {
    if (!req.auth) throw new Error('Cannot get user without login');

    // get fresh user data
    const userData = await db.getUserById(req.auth.id);

    // remove password data from user object
    const user = removePasswordandAddToken(userData);

    // return user and appointments
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: `could not get user: ${e}` });
  }
}

export async function getUserAppointments(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  const paramId = Number(req.params.id);
  try {
    // get user's appointments
    const appointments = await db.getAppointments();
    const userAppointments = Object.values(appointments).filter(
      (a) => a.userId === paramId,
    );
    return res.status(200).json({
      appointments: userAppointments,
    });
  } catch (e) {
    return res.status(500).json({
      message: `could not get user appointments for id ${paramId}: ${e}`,
    });
  }
}

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;
    const existingUsers = await db.getUsers();
    const takenEmail = existingUsers.map((u) => u.email).includes(email);
    if (takenEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const userPasswordData = hashPassword(password);
    const newUser = await db.addUser({
      email,
      ...userPasswordData,
    });

    const user = removePasswordandAddToken(newUser);

    return res.status(201).json({ user });
  } catch (e) {
    return res.status(500).json({ message: `could not add user: ${e}` });
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    await db.deleteItem<AuthUser>(db.filenames.users, Number(id));
    return res.status(204);
  } catch (e) {
    return res.status(500).json({ message: `could not delete user: ${e}` });
  }
}

export async function update(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const { patch } = req.body;
    if (!patch) {
      return res
        .status(400)
        .json({ message: 'this endpoint requires a patch in the body' });
    }
    const updatedUser = await db.updateItem<AuthUser>(
      Number(id),
      db.filenames.users,
      patch,
    );

    const user = removePasswordandAddToken(updatedUser);

    return res.status(200).json({ user });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not update appointment: ${e}` });
  }
}

export async function auth(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  // auth user
  const users = await db.getUsers();
  const validUser = users.reduce(
    (foundUser: AuthUser | null, user) =>
      user.email === email && passwordIsValid(password, user)
        ? user
        : foundUser,
    null,
  );

  if (!validUser) return res.status(400).json({ message: 'Invalid login' });

  // create jwt
  const user = removePasswordandAddToken(validUser);

  return res.status(200).json({ user });
}

export default {
  get,
  getUserAppointments,
  create,
  remove,
  update,
  auth,
};
