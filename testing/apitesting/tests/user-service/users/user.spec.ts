import test, { APIRequestContext, expect, request } from '@playwright/test';
import { RegisterUserResponse } from '../../../interfaces/user-service/register';
import { ApiResponse } from '../../../interfaces/response';

test.describe('Register User', () => {
  let context: APIRequestContext;
  const username = 'registertester@coregate.dev';

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });
  });

  test('should register a new user successfully', async () => {
    const registerUrl = '/api/v1/users/register';
    const body = {
      email: username,
      password: 'Test1234',
      firstName: 'Register',
      lastName: 'Tester',
      phone: '123123299',
    };

    const response = await context.post(registerUrl, { data: body });

    const responseBody: ApiResponse<RegisterUserResponse> =
      await response.json();
    const { data } = responseBody;

    expect(response.status()).toEqual(201);
    expect(responseBody.status).toEqual('success');

    expect(data).toBeDefined();
    expect(data!.id).toBeDefined();
    expect(data!.email).toEqual(username);
    expect(data!.firstName).toEqual('Register');
    expect(data!.lastName).toEqual('Tester');
    expect(data!.phone).toEqual('123123299');
    expect(data!.createdAt).toBeDefined();
    expect(data!.updatedAt).toBeDefined();
  });

  test.afterAll(async () => {
    await context.delete('/api/v1/testing/clear-user-data', {
      data: { username: username },
    });
    await context.dispose();
  });
});
