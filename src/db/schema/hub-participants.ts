import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { hubs } from './hubs';
import { users } from './users';

export const hubParticipants = pgTable('hub_participants', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  hubId: integer('hub_id')
    .references(() => hubs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export type HubParticipant = typeof hubParticipants.$inferSelect;
export type NewHubParticipant = typeof hubParticipants.$inferInsert;
