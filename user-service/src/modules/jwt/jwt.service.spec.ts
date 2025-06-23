import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { KeycloakService } from '../keycloak/keycloak.service';
import { UserInfoResponse } from '../keycloak/keycloak.type';

describe('JwtService', () => {
  let service: JwtService;
  const mockKeycloakService = {
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: KeycloakService,
          useValue: mockKeycloakService,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToken', () => {
    it('should call KeycloakService.validateToken with the provided token', async () => {
      const token = 'test-token';
      const mockUserInfo: UserInfoResponse = {
        sub: 'E1DB84E8-2F26-42F3-9311-13D0569911DD',
        uid: '38EFE3E3-7136-4D3F-853E-B10297E983E8',
        name: 'John Doe',
        email_verified: true,
        preferred_username: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
      };

      mockKeycloakService.validateToken.mockResolvedValue(mockUserInfo);

      const result = await service.validateToken(token);

      expect(mockKeycloakService.validateToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockUserInfo);
    });
  });

  describe('extractToken', () => {
    it('should extract token from Authorization header', () => {
      const authHeader = 'Bearer test-token';
      const result = service.extractToken(authHeader);
      expect(result).toBe('test-token');
    });

    it('should return null if Authorization header is not provided', () => {
      const result = service.extractToken('');
      expect(result).toBeNull();
    });

    it('should return null if Authorization header format is invalid', () => {
      const authHeader = 'InvalidHeader test-token';
      const result = service.extractToken(authHeader);
      expect(result).toBeNull();
    });
  });
});
