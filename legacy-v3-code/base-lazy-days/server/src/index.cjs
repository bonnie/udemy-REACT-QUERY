/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
require('@babel/register')({ extensions: ['.js', '.ts'] });
const { startUp } = require('./server.ts');

startUp();
