/* eslint-disable import/no-unresolved */
import cors from 'cors';
import dotenv from 'dotenv';
import esMain from 'es-main';
import express, { json } from 'express';

import { User as UserType } from '../../shared/types';
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

/* *********** routes ********* */

// verify login
app.post('/signin', userRoutes.auth);

// user profile protected by jwt
app.get('/user/:id', validateUser, userRoutes.get);

app.post('/user', userRoutes.create);
app.delete('/user/:id', validateUser, userRoutes.remove);
app.patch('/user/:id', validateUser, userRoutes.update);

app.get('/appointments/:month/:year', appointmentRoutes.get);
app.delete('/appointment/:id', appointmentRoutes.remove);
app.patch('/appointment/:id', appointmentRoutes.update);

app.get('/treatments', treatmentRoutes.get);
app.get('/staff', staffRoutes.get);
/* *********** END: routes ********* */

if (esMain(import.meta)) {
  // eslint-disable-next-line no-console
  app.listen(3030, () => console.log('Spa server listening on port 3030!'));
}

export default app;
