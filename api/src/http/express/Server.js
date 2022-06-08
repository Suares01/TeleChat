import express from 'express';
import http from 'http';

export class ExpressServer {
  #app;

  constructor() {
    this.#app = express();
    this.http = http.createServer(this.#app);
  }

  prepare() {
    this.#middlewares();
  }

  start() {
    const port = process.env.PORT || 3333;
    this.http.listen(port, () =>
      console.log(`Express server is running on port ${port}`),
    );
  }

  close() {
    this.http.close((err) => {
      if (err) throw err;
    });
  }

  #middlewares() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
  }
}
