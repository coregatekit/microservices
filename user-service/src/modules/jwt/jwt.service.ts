import { Injectable, Logger } from '@nestjs/common';
import { KeycloakService } from '../keycloak/keycloak.service';
import { UserInfoResponse } from '../keycloak/keycloak.type';

@Injectable()
export class JwtService {
  private readonly logger: Logger;

  constructor(private keycloakService: KeycloakService) {
    this.logger = new Logger(JwtService.name);
  }

  async validateToken(token: string): Promise<UserInfoResponse | null> {
    return this.keycloakService.validateToken(token);
  }

  decodeToken(token: string): Promise<any> {
    this.logger.log('Method not implemented: decodeToken', token);
    throw new Error('Method not implemented.');
  }

  extractToken(authHeader: string): string | null {
    if (!authHeader) {
      this.logger.warn('No Authorization header provided');
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger.warn('Invalid Authorization header format');
      return null;
    }

    return parts[1];
  }
}
