import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { hubs } from './hubs';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: integer('author_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  hubId: integer('hub_id').references(() => hubs.id, {
    onDelete: 'cascade',
  }),
  body: text('body').notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
