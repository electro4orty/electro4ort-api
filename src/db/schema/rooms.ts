import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { hubs } from './hubs';

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  hubId: uuid('hub_id')
    .references(() => hubs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  name: varchar('name').notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
