import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info'],
});

const connect = async () => await prisma.$connect();

const disconnect = async () => await prisma.$disconnect();

prisma.$on('beforeExit', () =>
  console.log('Database disconnected using prisma'),
);

export { prisma, disconnect, connect };
