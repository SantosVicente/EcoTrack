import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@org/database';

import { DRIZZLE } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined');
        }
        const client = postgres(connectionString);
        return drizzle(client, {
          schema: {
            users: schema.users,
            sources: schema.sources,
            metrics: schema.metrics,
            thresholds: schema.thresholds,
            alerts: schema.alerts,
            usersRelations: schema.usersRelations,
            sourcesRelations: schema.sourcesRelations,
            metricsRelations: schema.metricsRelations,
            thresholdsRelations: schema.thresholdsRelations,
            alertsRelations: schema.alertsRelations,
          },
        });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
