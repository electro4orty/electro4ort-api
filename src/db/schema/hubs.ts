import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const hubs = pgTable('hubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  authorId: uuid('author_id')
    .references(() => users.id, {
      onDelete: 'restrict',
    })
    .notNull(),
  name: varchar('name').notNull(),
  avatar: varchar('avatar'),
});

export type Hub = typeof hubs.$inferSelect;
export type NewHub = typeof hubs.$inferInsert;
