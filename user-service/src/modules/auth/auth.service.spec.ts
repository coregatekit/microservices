import { ConfigService } from '@nestjs/config';
import { KeycloakService } from '../keycloak/keycloak.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;

  const mockConfigService = {
    get: jest.fn(),
  };
  const mockKeycloakService = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: KeycloakService, useValue: mockKeycloakService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };
      mockKeycloakService.login.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(mockKeycloakService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          username: email,
          password: password,
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when keycloak service fails', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockError = new Error('Keycloak login failed');
      mockKeycloakService.login.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        'Keycloak login failed',
      );
      expect(mockKeycloakService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          username: email,
          password: password,
        }),
      );
    });
  });

  describe('logout', () => {
    const refreshToken = 'mockRefreshToken';

    it('should successfully logout with valid refresh token', async () => {
      // Arrange
      const mockKeycloakResponse = {
        success: true,
        message: 'Logout successful',
      };
      mockKeycloakService.logout.mockResolvedValueOnce(mockKeycloakResponse);

      // Act
      const result = await service.logout(refreshToken);

      // Assert
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: refreshToken,
        }),
      );
      expect(result).toEqual({
        success: true,
        message: 'Logout successful',
      });
    });

    it('should return failure when keycloak logout fails', async () => {
      // Arrange
      const mockKeycloakResponse = {
        success: false,
        message: 'Logout failed',
      };
      mockKeycloakService.logout.mockResolvedValueOnce(mockKeycloakResponse);

      // Act
      const result = await service.logout(refreshToken);

      // Assert
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: refreshToken,
        }),
      );
      expect(result).toEqual({
        success: false,
        message: 'Logout failed',
      });
    });

    it('should throw error when keycloak service throws exception', async () => {
      // Arrange
      const mockError = new Error('Keycloak service error');
      mockKeycloakService.logout.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(service.logout(refreshToken)).rejects.toThrow(
        'Keycloak service error',
      );
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: refreshToken,
        }),
      );
    });

    it('should handle empty refresh token', async () => {
      // Arrange
      const emptyRefreshToken = '';
      const mockKeycloakResponse = {
        success: false,
        message: 'Invalid refresh token',
      };
      mockKeycloakService.logout.mockResolvedValueOnce(mockKeycloakResponse);

      // Act
      const result = await service.logout(emptyRefreshToken);

      // Assert
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: emptyRefreshToken,
        }),
      );
      expect(result).toEqual({
        success: false,
        message: 'Logout failed',
      });
    });

    it('should handle undefined keycloak response', async () => {
      // Arrange
      mockKeycloakService.logout.mockResolvedValueOnce(undefined);

      // Act
      const result = await service.logout(refreshToken);

      // Assert
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: refreshToken,
        }),
      );
      expect(result).toEqual({
        success: false,
        message: 'Logout failed',
      });
    });

    it('should handle null keycloak response', async () => {
      // Arrange
      mockKeycloakService.logout.mockResolvedValueOnce(null);

      // Act
      const result = await service.logout(refreshToken);

      // Assert
      expect(mockKeycloakService.logout).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: refreshToken,
        }),
      );
      expect(result).toEqual({
        success: false,
        message: 'Logout failed',
      });
    });
  });
});
