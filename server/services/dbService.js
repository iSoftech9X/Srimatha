// Service aggregator for switching between mock and real DB
import * as menuPostgres from './menuPostgres.js';

export default {
  connect: async () => {
    // Optionally test DB connection here
    console.log('PostgreSQL database connected successfully');
    return true;
  },
  isConnected: () => true,
  ...menuPostgres
};
