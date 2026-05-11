import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPg = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const sql = globalForPg.__pgClient ?? postgres(url, { max: 10 });
if (process.env.NODE_ENV !== "production") {
  globalForPg.__pgClient = sql;
}

export const db = drizzle(sql, { schema });
export { schema };
export type Database = typeof db;
