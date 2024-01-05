import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import pbkdf2 from 'pbkdf2';

import { NewUser, User } from '../../shared/types';

export interface PasswordHash {
  salt: string;
  hash: string;
  iterations: number;
  keylen: number;
  digest: string;
}

export type NewAuthUser = NewUser & PasswordHash;
export type AuthUser = User & PasswordHash;

export function hashPassword(password: string): PasswordHash {
  const salt = crypto.randomBytes(128).toString('base64');
  const iterations = 10000;
  const keylen = 64;
  const digest = 'sha512';
  const hash = pbkdf2
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString();

  return {
    salt,
    hash,
    iterations,
    keylen,
    digest,
  };
}

export function passwordIsValid(password: string, user: AuthUser): boolean {
  const attemptHash = pbkdf2.pbkdf2Sync(
    password,
    user.salt,
    user.iterations,
    user.keylen,
    user.digest,
  );
  return user.hash === attemptHash.toString();
}

export function createJWT(user: User): string {
  return jsonwebtoken.sign(user, process.env.EXPRESS_SECRET);
}
