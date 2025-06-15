import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { AddAddressDto, transformAddressResponse } from './addresses';
import { AddAddressResponse, AddressResponse } from './addresses.interface';
import { sql } from 'drizzle-orm';
import { AddressType } from './addresses.enum';

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

  async getUserAddresses(userId: string): Promise<AddressResponse[]> {
    this.logger.log(`Fetching addresses for user ID: ${userId}`);
    const addresses = await this.db
      .select()
      .from(schema.addresses)
      .where(sql`${schema.addresses.userId} = ${userId}`);

    if (addresses.length === 0) {
      this.logger.warn(`No addresses found for user ID: ${userId}`);
      throw new NotFoundException(`No addresses found for user ID: ${userId}`);
    }

    this.logger.log('Transforming address responses');
    return addresses.map((address) => transformAddressResponse(address));
  }

  async getUserDefaultAddress(userId: string): Promise<AddressResponse[]> {
    this.logger.log(`Fetching default address for user ID: ${userId}`);
    const addresses = await this.db
      .select()
      .from(schema.addresses)
      .where(
        sql`${schema.addresses.userId} = ${userId} AND ${schema.addresses.isDefault} = true`,
      );

    if (addresses.length === 0) {
      this.logger.warn(`No default address found for user ID: ${userId}`);
      throw new NotFoundException(
        `No default address found for user ID: ${userId}`,
      );
    }

    this.logger.log('Transforming default address response');
    return addresses.map((address) => transformAddressResponse(address));
  }

  async getAddressById(
    addressId: string,
    userId: string,
  ): Promise<AddressResponse> {
    this.logger.log(
      `Fetching address with ID: ${addressId} for user ID: ${userId}`,
    );
    const address = await this.db
      .select()
      .from(schema.addresses)
      .where(
        sql`${schema.addresses.id} = ${addressId} AND ${schema.addresses.userId} = ${userId}`,
      )
      .limit(1);

    if (address.length === 0) {
      this.logger.warn(
        `Address with ID: ${addressId} not found for user ID: ${userId}`,
      );
      throw new NotFoundException(
        `Address with ID: ${addressId} not found for user ID: ${userId}`,
      );
    }

    this.logger.log('Transforming address response');
    return transformAddressResponse(address[0]);
  }

  async changeUserDefaultAddress(
    userId: string,
    addressId: string,
    type: AddressType,
  ): Promise<{ id: string }> {
    this.logger.log(
      `Changing default address for user ID: ${userId}, address ID: ${addressId}, type: ${type}`,
    );

    this.logger.log(
      `Finding address with ID: ${addressId} for user ID: ${userId}`,
    );
    const address = await this.db
      .select()
      .from(schema.addresses)
      .where(
        sql`${schema.addresses.id} = ${addressId} AND ${schema.addresses.userId} = ${userId}  AND ${schema.addresses.type} = ${type}`,
      )
      .limit(1);

    if (address.length === 0) {
      this.logger.warn(
        `Address with ID: ${addressId} not found for user ID: ${userId}`,
      );
      throw new NotFoundException(
        `Address with ID: ${addressId} not found for user ID: ${userId}`,
      );
    }

    // Set deafult to false for all addresses with input type of the user
    this.logger.log(
      `Setting all addresses of type ${type} to not default for user ID: ${userId}`,
    );
    await this.db
      .update(schema.addresses)
      .set({
        isDefault: false,
      })
      .where(
        sql`${schema.addresses.userId} = ${userId} AND ${schema.addresses.type} = ${type}`,
      );

    // Set the selected address to default
    this.logger.log(
      `Setting address ID: ${addressId} as default for user ID: ${userId}`,
    );
    const updatedAddressId = await this.db
      .update(schema.addresses)
      .set({ isDefault: true })
      .where(
        sql`${schema.addresses.id} = ${addressId} AND ${schema.addresses.userId} = ${userId}`,
      )
      .returning({
        id: schema.addresses.id,
      });

    this.logger.log(
      `Default address changed successfully for user ID: ${userId}, address ID: ${addressId}`,
    );
    return { id: updatedAddressId[0].id };
  }
}
