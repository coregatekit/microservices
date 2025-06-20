import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AccessTokenResponse,
  CreateKeycloakUserRequest,
  KeycloakLoginResponse,
  LoginResponse,
} from './keycloak.type';
import { CreateKeycloakUser, LoginRequest } from './keycloak';

@Injectable()
export class KeycloakService {
  private readonly BASE_URL: string;
  private readonly KEYCLOAK_REALM: string;
  private readonly KEYCLOAK_CLIENT_ID: string;
  private readonly KEYCLOAK_CLIENT_SECRET: string;
  private readonly KEYCLOAK_CLIENT_ID_LOGIN_REQUEST: string;
  private readonly KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST: string;
  private readonly logger: Logger;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(KeycloakService.name);
    this.BASE_URL = this.configService.get<string>('KEYCLOAK_BASE_URL') || '';
    this.KEYCLOAK_REALM =
      this.configService.get<string>('KEYCLOAK_REALM') || '';
    this.KEYCLOAK_CLIENT_ID =
      this.configService.get<string>('KEYCLOAK_CLIENT_ID') || '';
    this.KEYCLOAK_CLIENT_SECRET =
      this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
    this.KEYCLOAK_CLIENT_ID_LOGIN_REQUEST =
      this.configService.get<string>('KEYCLOAK_CLIENT_ID_LOGIN_REQUEST') || '';
    this.KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST =
      this.configService.get<string>('KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST') ||
      '';
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.log('Logging in to Keycloak');
    const url = `${this.BASE_URL}/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.KEYCLOAK_CLIENT_ID_LOGIN_REQUEST);
    params.append('client_secret', this.KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST);
    params.append('grant_type', 'password');
    params.append('username', request.username);
    params.append('password', request.password);
    params.append('scope', 'openid profile email');

    this.logger.log('Sending login request to Keycloak');

    const { data } = await firstValueFrom(
      this.httpService.post<KeycloakLoginResponse>(url, params).pipe(
        catchError((error) => {
          this.logger.error(`Error logging in to Keycloak: ${error}`);
          throw new Error('Failed to login to Keycloak');
        }),
      ),
    );

    if (!data || !data.accessToken) {
      this.logger.error('Failed to retrieve access token from Keycloak');
      throw new Error('Failed to retrieve access token from Keycloak');
    }

    this.logger.log('Login successful, access token retrieved');
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
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
      this.httpService.post<AccessTokenResponse>(url, params).pipe(
        catchError((error) => {
          this.logger.error(
            `Error fetching access token from Keycloak: ${error}`,
          );
          throw new Error('Failed to fetch access token from Keycloak');
        }),
      ),
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
      this.httpService
        .post(url, userPayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(`Error creating user in Keycloak: ${error}`);
            throw new Error('Failed to create user in Keycloak');
          }),
        ),
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
