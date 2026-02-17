import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './lib/schema.js';

const connectionString = process.env.DATABASE_URL || '';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from './lib/schema.js';
export { eq };
export type Schema = typeof schema;
export type DrizzleDB = PostgresJsDatabase<Schema>;
