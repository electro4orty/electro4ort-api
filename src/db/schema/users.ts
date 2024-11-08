import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  displayName: varchar('display_name').notNull(),
  avatar: varchar('avatar'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
