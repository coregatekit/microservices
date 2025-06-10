import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';

const mockDb = {
  query: {
    users: {
      findFirst: jest.fn(),
    },
  },
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

      const result = await service.login(email, password);

      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
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
});
