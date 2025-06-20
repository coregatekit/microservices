import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from '../keycloak/keycloak.service';

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
}
