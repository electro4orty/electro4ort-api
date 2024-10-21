import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { hubs } from './hubs';
import { users } from './users';

export const hubParticipants = pgTable('hub_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  hubId: uuid('hub_id')
    .references(() => hubs.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export type HubParticipant = typeof hubParticipants.$inferSelect;
export type NewHubParticipant = typeof hubParticipants.$inferInsert;
