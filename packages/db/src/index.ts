import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@repo/env/server";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

/**
 * Disable prefetch as it is not supported for Supabase "Transaction" pool mode.
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-transaction-mode
 */
const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, { prepare: false });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

/**
 * Automatically map camelCase to snake_case in the database.
 * @see https://orm.drizzle.team/docs/sql-schema-declaration#camel-and-snake-casing
 */
export const db = drizzle(conn, { schema, casing: "snake_case" });
