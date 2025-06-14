import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import { AddAddressDto } from './addresses';
import * as schema from '../../db/drizzle/schema';
import { sql } from 'drizzle-orm';

const mockDb = {
  query: {
    users: {
      findFirst: jest.fn(),
    },
  },
  select: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  insert: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
};

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addNewAddress', () => {
    it('should add a new address successfully', async () => {
      const addressData: AddAddressDto = {
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      };

      mockDb.query.users.findFirst = jest.fn().mockResolvedValue({
        id: 'user123',
      });
      mockDb.insert = jest.fn().mockReturnThis();
      mockDb.values = jest.fn().mockReturnThis();
      mockDb.returning = jest
        .fn()
        .mockResolvedValue([{ id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3' }]);

      const result = await service.addNewAddress(addressData);

      expect(result).toBeDefined();
      expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
      expect(mockDb.values).toHaveBeenCalledWith({
        userId: addressData.userId,
        type: addressData.type,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: addressData.isDefault,
      });
      expect(result).toEqual({ id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3' });
    });

    it('should throw an error if user does not exist', async () => {
      const addressData: AddAddressDto = {
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      };

      mockDb.query.users.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.addNewAddress(addressData)).rejects.toThrow(
        `User with ID ${addressData.userId} does not exist`,
      );
    });

    it('should throw an error if address addition fails', async () => {
      const addressData: AddAddressDto = {
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
      };

      mockDb.query.users.findFirst = jest.fn().mockResolvedValue({
        id: 'user123',
      });
      mockDb.insert = jest.fn().mockReturnThis();
      mockDb.values = jest.fn().mockReturnThis();
      mockDb.returning = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.addNewAddress(addressData)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getUserAddresses', () => {
    const userId = 'user123';
    mockDb.select = jest.fn().mockReturnThis();
    mockDb.from = jest.fn().mockReturnThis();
    const mockAddress = {
      id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
      userId: 'user123',
      type: 'SHIPPING',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'USA',
      isDefault: true,
      createdAt: new Date('2025-06-12T00:00:00Z'),
      updatedAt: new Date('2025-06-12T00:00:00Z'),
    };

    it('should return a list of addresses for a user', async () => {
      mockDb.where = jest.fn().mockReturnValue([mockAddress]);

      const result = await service.getUserAddresses(userId);

      expect(result).toBeDefined();
      expect(result).toEqual([mockAddress]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.addresses);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.addresses.userId} = ${userId}`,
      );
    });

    it('should throw an error if no addresses found for user', async () => {
      mockDb.where = jest.fn().mockReturnValue([]);

      await expect(service.getUserAddresses(userId)).rejects.toThrow(
        `No addresses found for user ID: ${userId}`,
      );
    });

    it('should return partial addresses if some fields are missing', async () => {
      const partialAddress = {
        id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
        userId: 'user123',
        type: 'SHIPPING',
        addressLine1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
        isDefault: true,
        createdAt: new Date('2025-06-12T00:00:00Z'),
        updatedAt: new Date('2025-06-12T00:00:00Z'),
      };

      mockDb.where = jest.fn().mockReturnValue([partialAddress]);

      const result = await service.getUserAddresses(userId);

      expect(result).toBeDefined();
      expect(result).toEqual([partialAddress]);
      expect(result[0].addressLine2).toBeUndefined();
    });
  });
});
