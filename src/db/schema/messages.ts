import {
  AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { rooms } from './rooms';

export const messageType = pgEnum('message_type', [
  'text',
  'gif',
  'audio',
  'video',
]);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
  authorId: uuid('author_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  roomId: uuid('room_id')
    .references(() => rooms.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  body: text('body').notNull(),
  type: messageType('type').notNull().default('text'),
  replyToId: uuid('reply_to_id').references((): AnyPgColumn => messages.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
