import { relations } from 'drizzle-orm/relations';
import { users, addresses } from './schema';

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
}));
