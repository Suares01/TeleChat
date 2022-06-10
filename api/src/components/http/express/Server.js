import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

import * as database from '../../../database/prisma';

export class ExpressServer {
  #app;

  constructor() {
    this.#app = express();
    this.http = http.createServer(this.#app);
  }

  async prepare() {
    this.#middlewares();
    await database.connect();
  }

  start() {
    const port = process.env.PORT || 3333;
    this.http.listen(port, () =>
      console.log(`Express server is running on port ${port}`),
    );
  }

  async close() {
    await database.disconnect();
    this.http.close((err) => {
      if (err) throw err;
    });
  }

  #middlewares() {
    this.#app.use(helmet());
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(compression());
  }
}
