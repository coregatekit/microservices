import test, { APIRequestContext, expect, request } from '@playwright/test';
import { ApiResponse } from '../../../interfaces/response';
import { LoginResponse } from '../../../interfaces/user-service/auth';
import {
  AddAddressRequest,
  AddressResponse,
} from '../../../interfaces/user-service/address';

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

test.describe('Get all addresses', () => {
  let context: APIRequestContext;
  let accessToken: string;
  const addressRoute = '/api/v1/addresses';

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });

    const loginResponse = await context.post('/api/v1/auth/login', {
      data: {
        email: 'addresstester@coregate.dev',
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

  test('should retrieve all addresses successfully', async () => {
    const response = await context.get(addressRoute, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: ApiResponse<AddressResponse[]> = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.data).toBeDefined();
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });

  test('should fail to retrieve addresses without authentication', async () => {
    const response = await context.get(addressRoute);

    expect(response.status()).toEqual(401);
  });
});

test.describe('Get address details', () => {
  let context: APIRequestContext;
  let accessToken: string;
  const addressRoute = '/api/v1/addresses';
  const billingAddressId = 'e969975f-b4a7-43d5-9809-555ecccd3771';
  const shippingAddressId = '9550e74c-252a-4d20-bbb8-0e0662cc2cd1';

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });

    const loginResponse = await context.post('/api/v1/auth/login', {
      data: {
        email: 'addresstester@coregate.dev',
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

  test('should retrieve billing address details successfully', async () => {
    const response = await context.get(`${addressRoute}/${billingAddressId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: ApiResponse<AddressResponse> = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data!.id).toEqual(billingAddressId);
    expect(responseBody.data!.type).toEqual('BILLING');
    expect(responseBody.data!.addressLine1.includes('56')).toBeTruthy(); // 56 is part of the address line in database
  });

  test('should retrieve shipping address details successfully', async () => {
    const response = await context.get(`${addressRoute}/${shippingAddressId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: ApiResponse<AddressResponse> = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data!.id).toEqual(shippingAddressId);
    expect(responseBody.data!.type).toEqual('SHIPPING');
    expect(responseBody.data!.addressLine1.includes('69')).toBeTruthy(); // 69 is part of the address line in database
  });
});

test.describe('Get default addresses', () => {
  let context: APIRequestContext;
  let accessToken: string;
  const addressRoute = '/api/v1/addresses/default';

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });

    const loginResponse = await context.post('/api/v1/auth/login', {
      data: {
        email: 'addresstester@coregate.dev',
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

  test('should retrieve default addresses successfully', async () => {
    const response = await context.get(addressRoute, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: ApiResponse<AddressResponse[]> = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseBody.status).toEqual('success');
    expect(responseBody.data).toBeDefined();
    expect(Array.isArray(responseBody.data)).toBeTruthy();
    responseBody.data?.forEach((address) => {
      expect(address.isDefault).toBeTruthy();
    });
    expect(responseBody.data!.length).toBe(2);
    expect(responseBody.data?.some((address) => address.type === 'BILLING')).toBeTruthy();
    expect(responseBody.data?.some((address) => address.type === 'SHIPPING')).toBeTruthy();
  });
});
