import { users } from '../../db/drizzle/schema';

export type UserDB = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
