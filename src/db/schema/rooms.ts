import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { hubs } from './hubs';

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  hubId: integer('hub_id')
    .references(() => hubs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  title: varchar('title').notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
