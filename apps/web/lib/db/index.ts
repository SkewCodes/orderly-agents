import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof createDrizzle>;

function createDrizzle() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  const client = postgres(connectionString, {
    prepare: false,
    connect_timeout: 5,
    idle_timeout: 20,
    max: 10,
  });
  return drizzle(client, { schema });
}

let _db: Db | undefined;

function getDb(): Db {
  if (!_db) {
    _db = createDrizzle();
  }
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type Database = Db;
