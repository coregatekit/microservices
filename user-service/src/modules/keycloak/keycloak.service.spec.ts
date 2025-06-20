/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { CreateKeycloakUser, LoginRequest } from './keycloak';

describe('KeycloakService', () => {
  let service: KeycloakService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'KEYCLOAK_BASE_URL':
          return 'http://mock-keycloak-url';
        case 'KEYCLOAK_REALM':
          return 'mock-realm';
        case 'KEYCLOAK_CLIENT_ID':
          return 'mock-client-id';
        case 'KEYCLOAK_CLIENT_SECRET':
          return 'mock-client-secret';
        case 'KEYCLOAK_CLIENT_ID_LOGIN_REQUEST':
          return 'mock-client-id-login-request';
        case 'KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST':
          return 'mock-client-secret-login-request';
        default:
          return null;
      }
    }),
  };
  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<KeycloakService>(KeycloakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login to Keycloak', async () => {
      const loginRequest = new LoginRequest('mock_username', 'mock_password');
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: {
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });

      const result = await service.login(loginRequest);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://mock-keycloak-url/realms/mock-realm/protocol/openid-connect/token',
        expect.any(URLSearchParams),
      );
      expect(result).toEqual({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      });
    });

    it('should throw an error if login fails', async () => {
      const loginRequest = new LoginRequest('mock_username', 'mock_password');
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: {},
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });

      await expect(service.login(loginRequest)).rejects.toThrow(
        'Failed to retrieve access token from Keycloak',
      );
    });
  });

  describe('getAccessToken', () => {
    it('should return an access token', async () => {
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: { access_token: 'mock_access_token' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });
      const result = await service.getAccessToken();

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://mock-keycloak-url/realms/mock-realm/protocol/openid-connect/token',
        expect.any(URLSearchParams),
      );
      expect(result).toEqual('mock_access_token');
    });

    it('should throw an error if access token retrieval fails', async () => {
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: {},
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });

      await expect(service.getAccessToken()).rejects.toThrow(
        'Failed to retrieve access token from Keycloak',
      );
    });
  });

  describe('createUser', () => {
    it('should create a user in Keycloak', async () => {
      const data = new CreateKeycloakUser({
        uid: '12345',
        email: '',
        firstName: 'John',
        lastName: 'Doe',
        password: 'secureP@ssw0rd',
      });
      service.getAccessToken = jest.fn().mockResolvedValue('mock_access_token');
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: {},
          status: 201,
          statusText: 'Created',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });

      await service.createUser(data);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://mock-keycloak-url/admin/realms/mock-realm/users',
        {
          enabled: true,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          credentials: [
            {
              type: 'password',
              value: data.password,
              temporary: false,
            },
          ],
          attributes: {
            uid: data.uid,
          },
        },
        {
          headers: {
            Authorization: `Bearer mock_access_token`,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should throw an error if user creation fails', async () => {
      const data = new CreateKeycloakUser({
        email: '',
        firstName: 'John',
        lastName: 'Doe',
        password: 'secureP@ssw0rd',
      });

      service.getAccessToken = jest.fn().mockResolvedValue('mock_access_token');
      mockHttpService.post.mockImplementation(() => {
        const mockResponse: AxiosResponse = {
          data: {},
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: { headers: {} as any },
        };
        return of(mockResponse);
      });
      await expect(service.createUser(data)).rejects.toThrow(
        'Failed to create user in Keycloak',
      );
    });
  });
});
