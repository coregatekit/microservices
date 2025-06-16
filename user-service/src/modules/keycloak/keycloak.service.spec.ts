/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

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
  });
});
