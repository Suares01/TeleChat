import 'reflect-metadata';
import '../src/shared/containers';
import supertest from 'supertest';
import { Container } from 'typedi';

const server = Container.get('Server');

beforeAll(() => {
  server.prepare();
  server.start();
  global.request = supertest(server.http);
});

afterAll(() => server.close());
