import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { AddAddressDto } from './addresses';
import { AddAddressResponse } from './addresses.interface';

@Injectable()
export class AddressesService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async addNewAddress(data: AddAddressDto): Promise<AddAddressResponse> {
    const {
      userId,
      type,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = data;

    try {
      const result = await this.db
        .insert(schema.addresses)
        .values({
          userId,
          type,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country,
          isDefault,
        })
        .returning({
          id: schema.addresses.id,
        });

      return { id: result[0].id };
    } catch (error) {
      console.error('Error adding address:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to add address: ${error.message}`);
      }
      throw new Error('Failed to add address');
    }
  }
}
