import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/utils/env';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  public readonly db: PostgresJsDatabase<typeof schema>;
  private readonly client: postgres.Sql;

  constructor() {
    this.client = postgres(env.DB_URL);
    this.db = drizzle(this.client, {
      schema,
    });
  }

  onModuleDestroy() {
    this.client.end();
  }
}
