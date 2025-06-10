import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with email and password', async () => {
      const loginRequest = {
        email: 'john@example.com',
        password: 'securepassword',
      };

      const loginResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      authService.login = jest.fn().mockResolvedValue(loginResponse);

      const result = await controller.login(loginRequest);

      expect(result).toEqual(loginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginRequest.email,
        loginRequest.password,
      );
    });
  });
});
