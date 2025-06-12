import { addresses } from '../../db/drizzle/schema';

export type AddressDB = typeof addresses.$inferSelect;
export type AddressInsert = typeof addresses.$inferInsert;

export interface AddAddressResponse {
  id: string;
}
