/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { sql } from 'drizzle-orm';
import { KeycloakService } from '../keycloak/keycloak.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  };
  const mockKeycloakService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
        {
          provide: KeycloakService,
          useValue: mockKeycloakService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createUser', () => {
  //   const mockUserResponse = {
  //     id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
  //     email: 'john@example.com',
  //     name: 'John Doe',
  //     createdAt: new Date('2025-06-12T00:00:00Z'),
  //     updatedAt: new Date('2025-06-12T00:00:00Z'),
  //   };

  //   const setupMockDbSuccess = (response: any) => {
  //     mockDb.where.mockReturnValue([]);
  //     mockDb.returning.mockResolvedValue([response]);
  //   };

  //   it('should create a user successfully with all fields', async () => {
  //     const userWithPhone = { ...mockUserResponse, phone: '123-456-7890' };
  //     setupMockDbSuccess(userWithPhone);

  //     const createUserDto = {
  //       email: 'john@example.com',
  //       password: 'securepassword',
  //       name: 'John Doe',
  //       phone: '123-456-7890',
  //     };

  //     const result = await service.createUser(createUserDto);

  //     expect(mockDb.select).toHaveBeenCalled();
  //     expect(mockDb.from).toHaveBeenCalledWith(schema.users);
  //     expect(mockDb.where).toHaveBeenCalledWith(
  //       sql`${schema.users.email} = ${createUserDto.email}`,
  //     );
  //     expect(mockDb.insert).toHaveBeenCalledWith(schema.users);
  //     expect(mockDb.values).toHaveBeenCalledWith({
  //       email: createUserDto.email,
  //       name: createUserDto.name,
  //       password: expect.any(String), // Password should be hashed in actual implementation
  //       phone: createUserDto.phone,
  //     });
  //     expect(mockDb.returning).toHaveBeenCalledWith({
  //       id: schema.users.id,
  //       email: schema.users.email,
  //       name: schema.users.name,
  //       phone: schema.users.phone,
  //       createdAt: schema.users.createdAt,
  //       updatedAt: schema.users.updatedAt,
  //     });
  //     expect(result).toBeDefined();
  //     expect(result.email).toBe(createUserDto.email);
  //     expect(result.phone).toBe(createUserDto.phone);
  //   });

  //   it('should create a user with optional phone number', async () => {
  //     setupMockDbSuccess(mockUserResponse);

  //     const createUserDto = {
  //       email: 'john@example.com',
  //       password: 'securepassword',
  //       name: 'John Doe',
  //     };

  //     const result = await service.createUser(createUserDto);

  //     expect(mockDb.values).toHaveBeenCalledWith({
  //       email: createUserDto.email,
  //       name: createUserDto.name,
  //       password: expect.any(String),
  //     });
  //     expect(result).toBeDefined();
  //     expect(result.email).toBe(createUserDto.email);
  //     expect(result.phone).toBeUndefined();
  //   });

  //   it('should throw an error if user already exists', async () => {
  //     mockDb.where.mockReturnValue([{ email: 'tester@example.com' }]);

  //     const createUserDto = {
  //       email: 'tester@example.com',
  //       password: 'securepassword',
  //       name: 'Test User',
  //       phone: '123-456-7890',
  //     };

  //     await expect(service.createUser(createUserDto)).rejects.toThrow(
  //       'User already exists',
  //     );
  //   });
  // });

  describe('registerUser', () => {
    const mockUserResponse = {
      id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date('2025-06-12T00:00:00Z'),
      updatedAt: new Date('2025-06-12T00:00:00Z'),
    };
    const createUserDto = {
      email: 'john@example.com',
      password: 'securepassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      mockDb.from.mockReset();
      mockDb.where.mockReset();
      mockDb.insert.mockReset();
      mockDb.values.mockReset();
      mockDb.returning.mockReset();
    });

    it('should register a user successfully with all fields', async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnValue([]);

      const result = await service.registerUser(createUserDto);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.users);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.users.email} = ${createUserDto.email}`,
      );
      expect(result).toBeDefined();
    });

    it('should throw an error if user already exists', async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnValue([{ email: '' }]);

      await expect(service.registerUser(createUserDto)).rejects.toThrow(
        'User already exists',
      );
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.users);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.users.email} = ${createUserDto.email}`,
      );
    });
  });
});
