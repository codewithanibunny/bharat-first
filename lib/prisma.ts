import { PrismaClient } from '@prisma/client';

const isProd = process.env.NODE_ENV === 'production';

const prismaClientSingleton = () => {
  return new PrismaClient({
    // In production: only log warnings and errors to avoid SQL leakage and overhead.
    // In development: log queries for debugging convenience.
    log: isProd
      ? ['warn', 'error']
      : ['query', 'info', 'warn', 'error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Preserve singleton in development hot-reload
if (!isProd) globalThis.prismaGlobal = prisma;
