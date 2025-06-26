import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
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

  describe('logout', () => {
    const refreshToken = 'mockRefreshToken';

    it('should successfully logout user with valid refresh token', async () => {
      // Arrange
      const mockLogoutResponse = {
        success: true,
        message: 'Logout successful',
      };
      mockAuthService.logout.mockResolvedValueOnce(mockLogoutResponse);

      // Act
      const result = await controller.logout(refreshToken);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual({
        status: 'success',
        message: 'Logout successful',
      });
    });

    it('should return error when logout fails', async () => {
      // Arrange
      const mockLogoutResponse = {
        success: false,
        message: 'Logout failed',
      };
      mockAuthService.logout.mockResolvedValueOnce(mockLogoutResponse);

      // Act
      const result = await controller.logout(refreshToken);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual({
        status: 'error',
        message: 'Logout failed',
      });
    });

    it('should handle service errors during logout', async () => {
      // Arrange
      mockAuthService.logout.mockRejectedValueOnce(new Error('Service error'));

      // Act & Assert
      await expect(controller.logout(refreshToken)).rejects.toThrow(
        'Service error',
      );
      expect(mockAuthService.logout).toHaveBeenCalledWith(refreshToken);
    });

    it('should handle empty refresh token', async () => {
      // Arrange
      const emptyRefreshToken = '';
      const mockLogoutResponse = {
        success: false,
        message: 'Invalid refresh token',
      };
      mockAuthService.logout.mockResolvedValueOnce(mockLogoutResponse);

      // Act
      const result = await controller.logout(emptyRefreshToken);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(emptyRefreshToken);
      expect(result).toEqual({
        status: 'error',
        message: 'Logout failed',
      });
    });

    it('should handle null refresh token', async () => {
      // Arrange
      const nullRefreshToken = null as unknown as string;
      const mockLogoutResponse = {
        success: false,
        message: 'Invalid refresh token',
      };
      mockAuthService.logout.mockResolvedValueOnce(mockLogoutResponse);

      // Act
      const result = await controller.logout(nullRefreshToken);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(nullRefreshToken);
      expect(result).toEqual({
        status: 'error',
        message: 'Logout failed',
      });
    });
  });
});
