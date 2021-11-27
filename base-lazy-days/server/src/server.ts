/* eslint-disable import/first */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@babel/register')({ extensions: ['.js', '.ts'] });

import cors from 'cors';
import dotenv from 'dotenv';
import esMain from 'es-main';
import express, { json } from 'express';
import jwt from 'express-jwt';

import { User as UserType } from '../../shared/types';
import { createAppointments } from './db-func/appointmentUtils.js';
// add .js for ts-node; https://github.com/microsoft/TypeScript/issues/41887#issuecomment-741902030
import { validateUser } from './middlewares/index.js';
import appointmentRoutes from './route-methods/appointment.js';
import staffRoutes from './route-methods/staff.js';
import treatmentRoutes from './route-methods/treatment.js';
import userRoutes from './route-methods/user.js';

dotenv.config();
if (!process.env.EXPRESS_SECRET) {
  // eslint-disable-next-line no-console
  console.error('EXPRESS_SECRET must be defined in .env\nEXITING.');
  process.exit(-1);
}

// typing for Express request with jwt
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: UserType;
    }
  }
}

const app = express();

// CORS for react app, assuming port 3000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

/* ********* middlewares ********* */
// use middleware to serve static images
app.use(express.static('public'));

// middleware for parsing json body
app.use(json());

app.use(
  '/user/:id',
  jwt({
    // process.env.EXPRESS_SECRET is checked for truthiness on app startup
    // the || is to satisfy typescript
    secret: process.env.EXPRESS_SECRET || 'NOT SO SECRET',
    algorithms: ['HS256'],
    requestProperty: 'auth',
  }),
);
app.use('/user/:id', validateUser);

// note: should really validate user for editing appointments
// I'm lazy and not implementing this. Spa managers beware!

/* *********** routes ********* */

// verify login
app.post('/signin', userRoutes.auth);

// user profile protected by jwt
app.get('/user/:id', userRoutes.get);
app.get('/user/:id/appointments', userRoutes.getUserAppointments);
app.delete('/user/:id', userRoutes.remove);
app.patch('/user/:id', userRoutes.update);

// adding user
app.post('/user', userRoutes.create);

app.get('/appointments/:year/:month', appointmentRoutes.get);
app.patch('/appointment/:id', appointmentRoutes.update);

app.get('/treatments', treatmentRoutes.get);
app.get('/staff', staffRoutes.get);
/* *********** END: routes ********* */

const startUp = async () => {
  // create appointments relevant to current date
  await createAppointments();

  // eslint-disable-next-line no-console
  app.listen(3030, () => console.log('Spa server listening on port 3030!'));
};

if (esMain(import.meta)) {
  startUp();
}

export default app;
