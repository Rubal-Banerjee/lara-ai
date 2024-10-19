import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  client: PrismaClientSingleton | undefined;
};

const client = globalForPrisma.client ?? prismaClientSingleton();

export default client;

if (process.env.NODE_ENV !== "production") globalForPrisma.client = client;
