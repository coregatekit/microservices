import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import { AddAddressDto } from './addresses';
import * as schema from '../../db/drizzle/schema';
import { sql } from 'drizzle-orm';

describe('AddressesService', () => {
  let service: AddressesService;
  const mockDb = {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
    limit: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  };

  const testAddress: AddAddressDto = {
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

  const mockAddress = {
    id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
    ...testAddress,
    createdAt: new Date('2025-06-12T00:00:00Z'),
    updatedAt: new Date('2025-06-12T00:00:00Z'),
  };

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
    beforeEach(() => {
      // Reset mocks for each test
      mockDb.query.users.findFirst.mockReset();
      mockDb.insert.mockReset();
      mockDb.values.mockReset();
      mockDb.returning.mockReset();
    });

    it('should add a new address successfully', async () => {
      // Arrange
      mockDb.query.users.findFirst.mockResolvedValue({
        id: testAddress.userId,
      });
      mockDb.insert.mockReturnValue(mockDb);
      mockDb.values.mockReturnValue(mockDb);
      mockDb.returning.mockResolvedValue([{ id: mockAddress.id }]);

      // Act
      const result = await service.addNewAddress(testAddress);

      // Assert
      expect(result).toEqual({ id: mockAddress.id });
      expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
      expect(mockDb.values).toHaveBeenCalledWith({
        userId: testAddress.userId,
        type: testAddress.type,
        addressLine1: testAddress.addressLine1,
        addressLine2: testAddress.addressLine2,
        city: testAddress.city,
        state: testAddress.state,
        postalCode: testAddress.postalCode,
        country: testAddress.country,
        isDefault: testAddress.isDefault,
      });
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      mockDb.query.users.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addNewAddress(testAddress)).rejects.toThrow(
        `User with ID ${testAddress.userId} does not exist`,
      );
    });

    it('should throw an error if address addition fails', async () => {
      // Arrange
      mockDb.query.users.findFirst.mockResolvedValue({
        id: testAddress.userId,
      });
      mockDb.insert.mockReturnValue(mockDb);
      mockDb.values.mockReturnValue(mockDb);
      mockDb.returning.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.addNewAddress(testAddress)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getUserAddresses', () => {
    const userId = 'user123';

    beforeEach(() => {
      // Reset mocks for each test
      mockDb.select.mockClear();
      mockDb.from.mockClear();
      mockDb.where.mockReset();
    });

    it('should return a list of addresses for a user', async () => {
      // Arrange
      mockDb.where.mockReturnValue([mockAddress]);

      // Act
      const result = await service.getUserAddresses(userId);

      // Assert
      expect(result).toEqual([mockAddress]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.addresses);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.addresses.userId} = ${userId}`,
      );
    });

    it('should throw an error if no addresses found for user', async () => {
      // Arrange
      mockDb.where.mockReturnValue([]);

      // Act & Assert
      await expect(service.getUserAddresses(userId)).rejects.toThrow(
        `No addresses found for user ID: ${userId}`,
      );
    });

    it('should return partial addresses if some fields are missing', async () => {
      // Arrange
      const partialAddress = { ...mockAddress };
      delete partialAddress.addressLine2;
      mockDb.where.mockReturnValue([partialAddress]);

      // Act
      const result = await service.getUserAddresses(userId);

      // Assert
      expect(result[0].addressLine2).toBeUndefined();
      expect(result).toEqual([partialAddress]);
    });
  });

  describe('getAddressById', () => {
    const addressId = 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3';
    const userId = 'user123';

    beforeEach(() => {
      // Reset mocks for each test
      mockDb.select.mockClear();
      mockDb.from.mockClear();
      mockDb.where.mockReset();
    });

    it('should return an address by ID for a user', async () => {
      // Arrange
      mockDb.where.mockReturnThis();
      mockDb.limit.mockReturnValue([mockAddress]);

      // Act
      const result = await service.getAddressById(addressId, userId);

      // Assert
      expect(result).toEqual(mockAddress);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.addresses);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.addresses.id} = ${addressId} AND ${schema.addresses.userId} = ${userId}`,
      );
    });

    it('should throw an error if address not found for user', async () => {
      // Arrange
      mockDb.where.mockReturnThis();
      mockDb.limit.mockReturnValue([]);

      // Act & Assert
      await expect(service.getAddressById(addressId, userId)).rejects.toThrow(
        `Address with ID: ${addressId} not found for user ID: ${userId}`,
      );
    });

    it('should return partial address if some fields are missing', async () => {
      // Arrange
      const partialAddress = { ...mockAddress };
      delete partialAddress.addressLine2;
      mockDb.where.mockReturnThis();
      mockDb.limit.mockReturnValue([partialAddress]);

      // Act
      const result = await service.getAddressById(addressId, userId);

      // Assert
      expect(result.addressLine2).toBeUndefined();
      expect(result).toEqual(partialAddress);
    });
  });
});
