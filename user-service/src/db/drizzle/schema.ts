import {
  pgTable,
  index,
  unique,
  uuid,
  varchar,
  timestamp,
  foreignKey,
  check,
  boolean,
  bigint,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    firstName: varchar('first_name', { length: 255 }).default('').notNull(),
    lastName: varchar('last_name', { length: 255 }).default('').notNull(),
  },
  (table) => [
    index('idx_users_email').using(
      'btree',
      table.email.asc().nullsLast().op('text_ops'),
    ),
    unique('users_email_key').on(table.email),
  ],
);

export const addresses = pgTable(
  'addresses',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    type: varchar({ length: 20 }).notNull(),
    addressLine1: varchar('address_line1', { length: 255 }).notNull(),
    addressLine2: varchar('address_line2', { length: 255 }),
    city: varchar({ length: 100 }).notNull(),
    state: varchar({ length: 100 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar({ length: 100 }).notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
  },
  (table) => [
    index('idx_addresses_type').using(
      'btree',
      table.type.asc().nullsLast().op('text_ops'),
    ),
    index('idx_addresses_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_addresses_user_id',
    }).onDelete('cascade'),
    check(
      'addresses_type_check',
      sql`(type)::text = ANY ((ARRAY['BILLING'::character varying, 'SHIPPING'::character varying])::text[])`,
    ),
  ],
);

export const schemaMigrations = pgTable('schema_migrations', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  version: bigint({ mode: 'number' }).primaryKey().notNull(),
  dirty: boolean().notNull(),
});
