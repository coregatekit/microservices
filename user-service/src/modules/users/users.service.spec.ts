import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { sql } from 'drizzle-orm';

const mockDb = {
  select: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  insert: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      mockDb.select = jest.fn().mockReturnThis();
      mockDb.from = jest.fn().mockReturnThis();
      mockDb.where = jest.fn().mockReturnValue([]);
      mockDb.insert = jest.fn().mockReturnThis();
      mockDb.values = jest.fn().mockReturnThis();
      mockDb.returning = jest.fn().mockResolvedValue([
        {
          id: 'FA831B00-7E34-4062-94BE-F4AB15F3FBE3',
          email: 'john@example.com',
          name: 'John Doe',
          phone: '123-456-7890',
          createdAt: new Date('2025-06-12T00:00:00Z'),
          updatedAt: new Date('2025-06-12T00:00:00Z'),
        },
      ]);

      const createUserDto = {
        email: 'john@example.com',
        password: 'securepassword',
        name: 'John Doe',
        phone: '123-456-7890',
      };

      const result = await service.createUser(createUserDto);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.users);
      expect(mockDb.where).toHaveBeenCalledWith(
        sql`${schema.users.email} = ${createUserDto.email}`,
      );
      expect(mockDb.insert).toHaveBeenCalledWith(schema.users);
      expect(mockDb.values).toHaveBeenCalledWith({
        email: createUserDto.email,
        name: createUserDto.name,
        password: expect.any(String) as string,
        phone: createUserDto.phone,
      });
      expect(mockDb.returning).toHaveBeenCalledWith({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        phone: schema.users.phone,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      });
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
    });
  });

  it('should throw an error if user already exists', async () => {
    mockDb.select = jest.fn().mockReturnThis();
    mockDb.from = jest.fn().mockReturnThis();
    mockDb.where = jest.fn().mockReturnValue([{ email: 'tester@example.com' }]);

    const createUserDto = {
      email: 'tester@example.com',
      password: 'securepassword',
      name: 'Test User',
      phone: '123-456-7890',
    };

    await expect(service.createUser(createUserDto)).rejects.toThrow(
      'User already exists',
    );
  });
});
