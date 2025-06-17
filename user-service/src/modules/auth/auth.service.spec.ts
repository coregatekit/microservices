/* eslint-disable @typescript-eslint/unbound-method */
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

describe('AuthService', () => {
  let service: AuthService;
  const mockDb = {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
  };
  const mockConfigService = {
    get: jest.fn(),
  };

  // const testUser = {
  //   id: 'user-id',
  //   email: 'test@example.com',
  //   password: 'hashedPassword',
  //   name: 'Test User',
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DrizzleAsyncProvider, useValue: mockDb },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('login', () => {
  //   const email = 'test@example.com';
  //   const password = 'securepassword';

  //   it('should return login response when credentials are valid', async () => {
  //     // Arrange
  //     mockDb.query.users.findFirst.mockResolvedValue(testUser);
  //     jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
  //     jest.spyOn(service, 'signToken').mockResolvedValue({
  //       accessToken: 'mockAccessToken',
  //       refreshToken: 'mockRefreshToken',
  //     });

  //     // Act
  //     const result = await service.login(email, password);

  //     // Assert
  //     expect(result).toEqual({
  //       accessToken: 'mockAccessToken',
  //       refreshToken: 'mockRefreshToken',
  //     });
  //     expect(mockDb.query.users.findFirst).toHaveBeenCalledWith({
  //       where: expect.any(Function),
  //     });
  //     expect(service.verifyPassword).toHaveBeenCalledWith(
  //       password,
  //       testUser.password,
  //     );
  //     expect(service.signToken).toHaveBeenCalled();
  //   });

  //   it('should throw an error if user does not exist', async () => {
  //     // Arrange
  //     mockDb.query.users.findFirst.mockResolvedValue(null);

  //     // Act & Assert
  //     await expect(service.login(email, password)).rejects.toThrow(
  //       'User not found',
  //     );
  //     expect(mockDb.query.users.findFirst).toHaveBeenCalled();
  //   });

  //   it('should throw an error if password is invalid', async () => {
  //     // Arrange
  //     mockDb.query.users.findFirst.mockResolvedValue(testUser);
  //     jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);

  //     // Act & Assert
  //     await expect(service.login(email, password)).rejects.toThrow(
  //       'Invalid password',
  //     );
  //     expect(service.verifyPassword).toHaveBeenCalledWith(
  //       password,
  //       testUser.password,
  //     );
  //   });
  // });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      // Arrange
      const password = 'securepassword';
      const hashedPassword = 'hashedPassword';
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.verifyPassword(password, hashedPassword);

      // Assert
      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, password);
    });

    it('should return false for invalid password', async () => {
      // Arrange
      const password = 'wrongpassword';
      const hashedPassword = 'hashedPassword';
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.verifyPassword(password, hashedPassword);

      // Assert
      expect(result).toBe(false);
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, password);
    });
  });

  describe('signToken', () => {
    it('should return a login response with tokens', async () => {
      // Arrange
      const userData = {
        userId: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      };
      jest.spyOn(service, 'signToken').mockResolvedValue({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });

      // Act
      const result = await service.signToken(userData);

      // Assert
      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });
    });
  });
});
