import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userStatus = pgEnum('user_status', ['online', 'offline']);

export type UserStatus = (typeof userStatus.enumValues)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  displayName: varchar('display_name').notNull(),
  avatar: varchar('avatar'),
  status: userStatus('status').notNull().default('offline'),
  birthDate: timestamp('birth_date'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
