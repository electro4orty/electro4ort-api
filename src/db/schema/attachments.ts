import {
  doublePrecision,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { messages } from './messages';

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  messageId: uuid('message_id')
    .notNull()
    .references(() => messages.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  fileName: varchar('file_name').notNull().unique(),
  mimeType: varchar('mime_type').notNull(),
  size: doublePrecision('size').notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
