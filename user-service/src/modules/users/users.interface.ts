import { users } from '../../db/drizzle/schema';

export type UserDB = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
