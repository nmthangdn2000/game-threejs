import 'dotenv/config.js';
import { Server } from './start/server';
import { Database } from './start/database';

(async () => {
  try {
    new Server().start();
    // new Database().connect();
  } catch (e) {
    console.log(`Cannot start server. Error: ${e}`);
  }
})();
