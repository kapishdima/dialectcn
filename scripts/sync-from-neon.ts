import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const BATCH_SIZE = 500;
const MIGRATIONS_FOLDER = "./drizzle";

type DB = PostgresJsDatabase<typeof schema>;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function connect(url: string) {
  const sql = postgres(url, { max: 4, prepare: false });
  const db = drizzle(sql, { schema }) as DB;
  return { sql, db };
}

async function copy<TRow extends Record<string, unknown>>(
  label: string,
  source: DB,
  target: DB,
  table: Parameters<DB["insert"]>[0],
) {
  const rows = (await source.select().from(table as never)) as TRow[];
  if (rows.length === 0) {
    console.log(`${label}: empty`);
    return;
  }
  let written = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await target
      .insert(table)
      .values(batch as never)
      .onConflictDoNothing();
    written += batch.length;
  }
  console.log(`${label}: source=${rows.length} written=${written}`);
}

async function main() {
  const sourceUrl = requireEnv("SOURCE_DATABASE_URL");
  const targetUrl = requireEnv("TARGET_DATABASE_URL");

  const source = connect(sourceUrl);
  const target = connect(targetUrl);

  try {
    console.log("Applying migrations to target...");
    await migrate(target.db, { migrationsFolder: MIGRATIONS_FOLDER });

    console.log("Copying rows...");
    await copy("user", source.db, target.db, schema.user);
    await copy("verification", source.db, target.db, schema.verification);
    await copy("session", source.db, target.db, schema.session);
    await copy("account", source.db, target.db, schema.account);
    await copy("preset", source.db, target.db, schema.preset);
    await copy("like", source.db, target.db, schema.like);

    console.log("Done.");
  } finally {
    await source.sql.end({ timeout: 5 });
    await target.sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
