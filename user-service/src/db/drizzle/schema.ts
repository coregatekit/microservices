import {
  pgTable,
  index,
  unique,
  uuid,
  varchar,
  timestamp,
  bigint,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
  },
  (table) => [
    index('idx_users_email').using(
      'btree',
      table.email.asc().nullsLast().op('text_ops'),
    ),
    unique('users_email_key').on(table.email),
  ],
);

export const schemaMigrations = pgTable('schema_migrations', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  version: bigint({ mode: 'number' }).primaryKey().notNull(),
  dirty: boolean().notNull(),
});
