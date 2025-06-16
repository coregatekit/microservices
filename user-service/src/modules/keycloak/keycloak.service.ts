import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { AccessTokenResponse } from './keycloak.type';

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

    const { data } = await firstValueFrom(
      this.httpService.post<AccessTokenResponse>(url, params).pipe(
        catchError((error: AxiosError) => {
          this.logger.error('Error fetching access token', error);
          throw new Error('Failed to fetch access token from Keycloak');
        }),
      ),
    );
    return data.access_token;
  }
}
