import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { rooms } from './rooms';

export const messages = pgTable('messages', {
  id: uuid('id').unique().primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: uuid('author_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  roomId: uuid('room_id')
    .references(() => rooms.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  body: text('body').notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
