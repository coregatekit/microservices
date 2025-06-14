import { addresses } from '../../db/drizzle/schema';

export type AddressDB = typeof addresses.$inferSelect;
export type AddressInsert = typeof addresses.$inferInsert;

export interface AddAddressResponse {
  id: string;
}
export interface AddressResponse {
  id: string;
  userId: string;
  type: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
