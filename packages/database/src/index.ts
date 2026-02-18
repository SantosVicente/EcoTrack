import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq, gt, and } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './lib/schema.js';

let _db: DrizzleDB | null = null;

export const getDb = () => {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL || '';
    const client = postgres(connectionString);
    _db = drizzle(client, { schema });
  }
  return _db;
};

export * from './lib/schema.js';
export { eq, gt, and };
export type Schema = typeof schema;
export type DrizzleDB = PostgresJsDatabase<Schema>;
