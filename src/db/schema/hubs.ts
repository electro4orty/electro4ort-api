import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const hubs = pgTable('hubs', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: integer('author_id')
    .references(() => users.id, {
      onDelete: 'restrict',
    })
    .notNull(),
  title: varchar('title').notNull(),
  avatar: varchar('avatar'),
});

export type Hub = typeof hubs.$inferSelect;
export type NewHub = typeof hubs.$inferInsert;
