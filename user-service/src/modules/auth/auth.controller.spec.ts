import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

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

    // Reset mocks between tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginRequest = {
      email: 'john@example.com',
      password: 'securepassword',
    };

    const loginResponse = {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };

    it('should call AuthService.login with correct credentials', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValueOnce(loginResponse);

      // Act
      const result = await controller.login(loginRequest);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginRequest.email,
        loginRequest.password,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Login successful',
        data: loginResponse,
      });
    });
  });
});
