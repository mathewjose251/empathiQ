/**
 * EmpathiQ Database Package
 *
 * Exports Prisma client singleton and schema types.
 */

import { PrismaClient } from "@prisma/client";

function applyDatabaseEnvAliases() {
  if (!process.env.DATABASE_URL) {
    const aliasedUrl =
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      "";

    if (aliasedUrl) {
      process.env.DATABASE_URL = aliasedUrl;
    }
  }

  if (!process.env.DATABASE_URL_DIRECT) {
    const aliasedDirectUrl =
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      "";

    if (aliasedDirectUrl) {
      process.env.DATABASE_URL_DIRECT = aliasedDirectUrl;
    }
  }
}

applyDatabaseEnvAliases();

const globalForPrisma = globalThis as typeof globalThis & {
  __empathiqPrisma?: PrismaClient;
};

export function hasDatabaseConnectionString() {
  applyDatabaseEnvAliases();
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.DATABASE_URL !== "undefined" &&
      process.env.DATABASE_URL !== "null",
  );
}

function createPrismaClient() {
  return new PrismaClient();
}

export function getPrismaClient() {
  if (!hasDatabaseConnectionString()) {
    return null;
  }

  if (globalForPrisma.__empathiqPrisma) {
    return globalForPrisma.__empathiqPrisma;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__empathiqPrisma = client;
  }

  return client;
}

function getPrismaClientOrThrow() {
  const client = getPrismaClient();

  if (!client) {
    throw new Error(
      "Prisma client requested without a PostgreSQL connection string. Connect Postgres or stay in preview memory mode.",
    );
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClientOrThrow();
    const value = client[property as keyof PrismaClient];

    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Re-export types from generated Prisma types
export * from "@prisma/client";
