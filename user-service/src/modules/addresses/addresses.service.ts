import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { AddAddressDto } from './addresses';
import { AddAddressResponse } from './addresses.interface';

@Injectable()
export class AddressesService {
  private readonly logger: Logger;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {
    this.logger = new Logger(AddressesService.name);
  }

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

    this.logger.log('Checking if user exists for address creation');
    const userExist = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!userExist) {
      this.logger.warn(
        `User with ID ${userId} does not exist, cannot add address`,
      );
      throw new BadRequestException(`User with ID ${userId} does not exist`);
    }

    this.logger.log(`Adding new address for user ID: ${userId}, type: ${type}`);
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

    this.logger.log(
      `Address added successfully for user ID: ${userId}, address ID: ${result[0].id}`,
    );
    return { id: result[0].id };
  }
}
