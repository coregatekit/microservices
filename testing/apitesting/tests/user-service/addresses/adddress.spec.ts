import test, { APIRequestContext, expect, request } from '@playwright/test';
import { ApiResponse } from '../../../interfaces/response';
import { LoginResponse } from '../../../interfaces/user-service/auth';
import { AddAddressRequest } from '../../../interfaces/user-service/address';

test.describe('Add new address', () => {
  let context: APIRequestContext;
  let accessToken: string;
  const addressRoute = '/api/v1/addresses';
  const newAddress: AddAddressRequest = {
    type: 'SHIPPING',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
    isDefault: true,
  };

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });

    const loginResponse = await context.post('/api/v1/auth/login', {
      data: {
        email: 'authtester@coregate.dev',
        password: 'sup3rS3cret',
      },
    });
    const loginResponseBody: ApiResponse<LoginResponse> =
      await loginResponse.json();

    if (!loginResponseBody.data) {
      console.error(
        'Login failed, no access token received',
        loginResponseBody,
      );
      throw new Error('Login failed, no access token received');
    }

    accessToken = loginResponseBody.data?.accessToken;
  });

  test('should add a new address successfully', async () => {
    const response = await context.post(addressRoute, {
      data: newAddress,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: ApiResponse<{ id: string }> = await response.json();

    expect(response.status()).toEqual(201);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data!.id).toBeDefined();
  });

  test('should fail to add a new address without authentication', async () => {
    const response = await context.post(addressRoute, {
      data: newAddress,
    });

    expect(response.status()).toEqual(401);
  });

  test.afterAll(async () => {
    await context.delete('/api/v1/testing/clear-all-user-addresses', {
      data: { username: 'authtester@coregate.dev' },
    });
    await context.dispose();
  });
});
