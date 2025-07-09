import test, { APIRequestContext, expect, request } from '@playwright/test';
import { ApiResponse } from '../../../interfaces/response';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
} from '../../../interfaces/user-service/auth';

test.describe('Authentication', () => {
  let context: APIRequestContext;

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });
  });

  test('should login successfully', async ({ request }) => {
    const body: LoginRequest = {
      email: 'authtester@coregate.dev',
      password: 'sup3rS3cret',
    };

    const response = await context.post('/api/v1/auth/login', { data: body });

    const responseBody: ApiResponse<LoginResponse> = await response.json();
    const { data } = responseBody;

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');

    expect(data).toBeDefined();
    expect(data!.accessToken).toBeDefined();
    expect(data!.refreshToken).toBeDefined();
  });

  test('should login failed when user is invalid', async ({ request }) => {
    const body: LoginRequest = {
      email: 'unknowntester@coregate.dev',
      password: 'sup3rS3cret',
    };

    const response = await context.post('/api/v1/auth/login', { data: body });

    expect(response.status()).toEqual(401);
  });

  test('should logout successfully', async () => {
    const loginReqest: LoginRequest = {
      email: 'authtester@coregate.dev',
      password: 'sup3rS3cret',
    };
    const loginResponse = await context.post('/api/v1/auth/login', {
      data: loginReqest,
    });
    const loginResponseBody: ApiResponse<LoginResponse> =
      await loginResponse.json();

    if (!loginResponseBody.data) {
      console.error(loginResponseBody);
      throw new Error('Login failed, no data returned');
    }

    const body: LogoutRequest = {
      refreshToken: loginResponseBody.data.refreshToken,
    };

    const response = await context.post('/api/v1/auth/logout', {
      headers: {
        Authorization: `Bearer ${loginResponseBody.data.accessToken}`,
      },
      data: body,
    });

    const responseBody: ApiResponse<unknown> = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.message).toEqual('Logout successful');
  });
});
