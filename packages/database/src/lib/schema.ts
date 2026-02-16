import {
  pgTable,
  uuid,
  varchar,
  text,
  doublePrecision,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS
export const metricStatusEnum = pgEnum('metric_status', [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
]);
export const metricTypeEnum = pgEnum('metric_type', [
  'ENERGY',
  'WATER',
  'WASTE',
  'CARBON',
]);
export const sourceTypeEnum = pgEnum('source_type', [
  'SENSOR',
  'MANUAL',
  'API',
]);
export const severityEnum = pgEnum('severity', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

// TABELAS

// 1. Users (Autenticação)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Sources (Origens das métricas: Prédios, Sensores)
export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdById: uuid('created_by')
    .references(() => users.id)
    .notNull(), // FK
  name: varchar('name', { length: 255 }).notNull(),
  type: sourceTypeEnum('type').notNull(),
  location: varchar('location', { length: 255 }),
  metadata: jsonb('metadata'), // Para guardar fatores de conversão específicos
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Metrics (O coração do sistema)
export const metrics = pgTable('metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceId: uuid('source_id')
    .references(() => sources.id)
    .notNull(), // FK
  createdById: uuid('created_by')
    .references(() => users.id)
    .notNull(), // FK
  type: metricTypeEnum('type').notNull(),
  rawValue: doublePrecision('raw_value').notNull(),
  calculatedValue: doublePrecision('calculated_value'),
  unit: varchar('unit', { length: 20 }).notNull(),
  status: metricStatusEnum('status').default('PENDING').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// 4. Thresholds (Regras para emitir alertas)
export const thresholds = pgTable('thresholds', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceId: uuid('source_id')
    .references(() => sources.id)
    .notNull(), // FK
  createdById: uuid('created_by')
    .references(() => users.id)
    .notNull(), // FK
  metricType: metricTypeEnum('metric_type').notNull(),
  maxValue: doublePrecision('max_value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Alerts (Gerados pelo Worker)
export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  metricId: uuid('metric_id')
    .references(() => metrics.id)
    .notNull(), // FK
  severity: severityEnum('severity').notNull(),
  message: text('message').notNull(),
  readAt: timestamp('read_at'), // Se null, não foi lido
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
  sources: many(sources),
  metrics: many(metrics),
}));

export const sourcesRelations = relations(sources, ({ one, many }) => ({
  author: one(users, {
    fields: [sources.createdById],
    references: [users.id],
  }),
  metrics: many(metrics),
  thresholds: many(thresholds),
}));

export const metricsRelations = relations(metrics, ({ one, many }) => ({
  source: one(sources, {
    fields: [metrics.sourceId],
    references: [sources.id],
  }),
  author: one(users, {
    fields: [metrics.createdById],
    references: [users.id],
  }),
  alerts: many(alerts),
}));

export const thresholdsRelations = relations(thresholds, ({ one }) => ({
  source: one(sources, {
    fields: [thresholds.sourceId],
    references: [sources.id],
  }),
  author: one(users, {
    fields: [thresholds.createdById],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  metric: one(metrics, {
    fields: [alerts.metricId],
    references: [metrics.id],
  }),
}));
