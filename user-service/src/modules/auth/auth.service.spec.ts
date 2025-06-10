/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

const mockDb = {
  query: {
    users: {
      findFirst: jest.fn(),
    },
  },
};
const mockJwtService = {
  signAsync: jest.fn(),
};
const mockConfigService = {
  get: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return login response with access and refresh tokens', async () => {
      const email = 'john@example.com';
      const password = 'securepassword';
      mockDb.query.users.findFirst.mockResolvedValue({
        id: 'user-id',
        email: 'john@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });
      service.verifyPassword = jest.fn().mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mockAccessToken');

      const result = await service.login(email, password);

      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });
      expect(mockDb.query.users.findFirst).toHaveBeenCalledWith({
        where: expect.any(Function),
      });
    });

    it('should throw an error if user does not exist', async () => {
      const email = 'alice@example.com';
      const password = 'securepassword';

      mockDb.query.users.findFirst.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if password is invalid', async () => {
      const email = 'alice@example.com';
      const password = 'wrongpassword';
      mockDb.query.users.findFirst.mockResolvedValue({
        id: 'user-id',
        email: 'alice@example.com',
        password: 'hashedPassword',
        name: 'Alice Doe',
      });

      service.verifyPassword = jest.fn().mockResolvedValue(false);
      await expect(service.login(email, password)).rejects.toThrow(
        'Invalid password',
      );
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      const password = 'securepassword';
      const hashedPassword = 'hashedPassword';

      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword(password, hashedPassword);
      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, password);
    });

    it('should return false for invalid password', async () => {
      const password = 'wrongpassword';
      const hashedPassword = 'hashedPassword';

      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword(password, hashedPassword);
      expect(result).toBe(false);
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, password);
    });
  });

  describe('signToken', () => {
    it('should return a login response with access and refresh tokens', async () => {
      const data = {
        userId: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
      };

      mockJwtService.signAsync.mockResolvedValue('mockAccessToken');
      const result = await service.signToken(data);
      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });
    });
  });
});
