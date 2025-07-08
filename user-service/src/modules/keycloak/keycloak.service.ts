import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AccessTokenResponse,
  CreateKeycloakUserRequest,
  KeycloakLoginResponse,
  KeycloakUser,
  LoginResponse,
  LogoutResponse,
  UserInfoResponse,
} from './keycloak.type';
import { CreateKeycloakUser, LoginRequest, LogoutRequest } from './keycloak';
import { Environment } from '../../utils/environment';

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

    if (!data || !data.access_token) {
      this.logger.error('Failed to retrieve access token from Keycloak');
      throw new Error('Failed to retrieve access token from Keycloak');
    }

    this.logger.log('Login successful, access token retrieved');
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }

  async getAccessToken(): Promise<string> {
    const url = `${this.BASE_URL}/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.KEYCLOAK_CLIENT_ID || '');
    params.append('client_secret', this.KEYCLOAK_CLIENT_SECRET || '');
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
    const url = `${this.BASE_URL}/admin/realms/${this.KEYCLOAK_REALM}/users`;

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

  async validateToken(token: string): Promise<UserInfoResponse | null> {
    this.logger.log('Validating access token with Keycloak');

    try {
      const url = `${this.BASE_URL}/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

      const { data } = await firstValueFrom(
        this.httpService
          .get<UserInfoResponse>(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((error) => {
              this.logger.error(`Error validating token: ${error}`);
              throw new Error('Failed to validate token');
            }),
          ),
      );

      this.logger.log('Token validated successfully');
      return data;
    } catch (error) {
      this.logger.error(`Error validating token: ${error}`);
      return null;
    }
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    this.logger.log('Logging out from Keycloak');

    try {
      const url = `${this.BASE_URL}/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/logout`;
      const params = new URLSearchParams();
      params.append('client_id', this.KEYCLOAK_CLIENT_ID_LOGIN_REQUEST);
      params.append('client_secret', this.KEYCLOAK_CLIENT_SECRET_LOGIN_REQUEST);
      params.append('refresh_token', request.refreshToken);

      this.logger.log('Sending logout request to Keycloak');

      const response = await firstValueFrom(
        this.httpService.post(url, params).pipe(
          catchError((error) => {
            this.logger.error(`Error logging out from Keycloak: ${error}`);
            throw new Error('Failed to logout from Keycloak');
          }),
        ),
      );

      if (response.status === 204 || response.status === 200) {
        this.logger.log('User logged out successfully from Keycloak');
        return {
          success: true,
          message: 'Logout successful',
        };
      } else {
        this.logger.error(
          `Failed to logout from Keycloak: ${response.statusText}`,
        );
        return {
          success: false,
          message: 'Logout failed',
        };
      }
    } catch (error) {
      this.logger.error(`Error during logout: ${error}`);
      return {
        success: false,
        message: 'Logout failed due to an error',
      };
    }
  }

  async clearUserData(username: string): Promise<void> {
    if (Environment.isProduction()) {
      this.logger.warn(
        'Attempted to clear user data in production environment. Operation aborted.',
      );
      throw new Error('Cannot clear user data in production environment');
    }

    this.logger.log(`Clearing user data for user: ${username}`);
    const accessToken = await this.getAccessToken();

    this.logger.log(`Fetching userId for user: ${username}`);
    const userInfoUrl = `${this.BASE_URL}/admin/realms/${this.KEYCLOAK_REALM}/users?username=${username}`;
    const userResponse = await firstValueFrom(
      this.httpService
        .get<KeycloakUser[]>(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(`Error fetching user info: ${error}`);
            throw new Error('Failed to fetch user info');
          }),
        ),
    );
    const userId = userResponse.data[0]?.id;

    this.logger.log(`Deleting user with ID: ${userId}`);
    const deleteUserUrl = `${this.BASE_URL}/admin/realms/${this.KEYCLOAK_REALM}/users/${userId}`;
    const deleteResponse = await firstValueFrom(
      this.httpService
        .delete(deleteUserUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(`Error deleting user: ${error}`);
            throw new Error('Failed to delete user');
          }),
        ),
    );

    if (deleteResponse.status !== 204) {
      this.logger.error(`Failed to delete user: ${deleteResponse.statusText}`);
      throw new Error('Failed to delete user');
    }

    this.logger.log(`User ${username} cleared successfully`);
  }
}
