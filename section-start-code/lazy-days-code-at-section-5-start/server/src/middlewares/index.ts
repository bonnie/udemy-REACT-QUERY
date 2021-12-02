import { NextFunction, Request, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Operation } from 'fast-json-patch';

import db from '../db-func';

export interface idParamsInterface extends ParamsDictionary {
  id: string;
}

export interface ResponseWithMessage {
  message: string;
}

export interface PatchRequest extends Request {
  patch?: Operation[];
}

export type AuthRequest = Request<
  idParamsInterface,
  ResponseWithMessage,
  PatchRequest,
  qs.ParsedQs,
  NextFunction
>;

// middleware for validating user
// eslint-disable-next-line consistent-return
export const validateUser: RequestHandler<
  idParamsInterface,
  ResponseWithMessage,
  PatchRequest,
  qs.ParsedQs,
  NextFunction
> = async (req, res, next) => {
  try {
    // check that the token matches the id url param (decoded token resides in req.user)
    const requestedId = Number(req.params.id);
    if (req.auth?.id !== requestedId) {
      res.status(401).send();
    } else {
      // find the user; will throw error if user doesn't exist
      await db.getUserById(requestedId);
      next();
    }
  } catch (error) {
    next(error);
  }
};
