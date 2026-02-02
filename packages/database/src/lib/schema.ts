import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
