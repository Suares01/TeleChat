import 'reflect-metadata';
import './shared/containers';
import { Container } from 'typedi';

const server = Container.get('Server');

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `App exiting due to an unhandled promsie: ${promise} ans reason: ${reason}`,
  );
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(1);
});

(async () => {
  try {
    server.prepare();
    server.start();

    exitSignals.forEach((signal) => {
      process.on(signal, () => {
        try {
          server.close();
          console.log('App exited with success');
          process.exit(0);
        } catch (error) {
          console.error(`App exited with error: ${error}`);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.log(`App exited with error: ${error}`);
    process.exit(1);
  }
})();
