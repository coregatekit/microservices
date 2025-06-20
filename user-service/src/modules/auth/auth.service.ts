import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from '../keycloak/keycloak.service';
import { LoginResponse } from './auth.type';
import { LoginRequest } from '../keycloak/keycloak';
import { DataMasker } from '../../common/data-mask';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(KeycloakService)
    private readonly keycloakService: KeycloakService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    this.logger.log(
      `Attempting to log in user with email: ${DataMasker.mask(email)}`,
    );
    try {
      const response = await this.keycloakService.login(
        new LoginRequest(email, password),
      );
      this.logger.log(
        `Login successful for user with email: ${DataMasker.mask(email)}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Login failed for user with email: ${DataMasker.mask(email)}`,
      );
      throw error;
    }
  }
}
