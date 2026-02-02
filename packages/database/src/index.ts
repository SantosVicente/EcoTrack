import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './lib/schema.js';

const connectionString = process.env.DATABASE_URL || '';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from './lib/schema.js';
