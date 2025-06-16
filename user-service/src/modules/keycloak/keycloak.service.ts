import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  AccessTokenResponse,
  CreateKeycloakUserRequest,
} from './keycloak.type';
import { CreateKeycloakUser } from './keycloak';

@Injectable()
export class KeycloakService {
  private readonly logger: Logger;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(KeycloakService.name);
  }

  async getAccessToken(): Promise<string> {
    const url = `${this.configService.get<string>('KEYCLOAK_BASE_URL')}/realms/${this.configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append(
      'client_id',
      this.configService.get<string>('KEYCLOAK_CLIENT_ID') || '',
    );
    params.append(
      'client_secret',
      this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '',
    );
    params.append('grant_type', 'client_credentials');

    this.logger.log('Fetching access token from Keycloak');
    const { data } = await firstValueFrom(
      this.httpService.post<AccessTokenResponse>(url, params),
    );

    if (!data || !data.access_token) {
      this.logger.error('Failed to retrieve access token from Keycloak');
      throw new Error('Failed to retrieve access token from Keycloak');
    }

    return data.access_token;
  }

  async createUser(userData: CreateKeycloakUser): Promise<void> {
    this.logger.log('Creating user in Keycloak');
    const accessToken = await this.getAccessToken();
    const url = `${this.configService.get<string>('KEYCLOAK_BASE_URL')}/admin/realms/${this.configService.get<string>('KEYCLOAK_REALM')}/users`;

    const userPayload: CreateKeycloakUserRequest = {
      enabled: true,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      credentials: [
        {
          type: 'password',
          value: userData.password,
          temporary: false,
        },
      ],
      attributes: {
        uid: userData.uid,
      },
    };

    this.logger.log('Sending request to create user in Keycloak');
    const response = await firstValueFrom(
      this.httpService.post(url, userPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    if (response.status !== 201) {
      this.logger.error(
        `Failed to create user in Keycloak: ${response.statusText}`,
      );
      throw new Error('Failed to create user in Keycloak');
    }

    this.logger.log('User created successfully in Keycloak');
  }
}
