import test, { APIRequestContext, request } from '@playwright/test';

test.describe('Register User', () => {
  let context: APIRequestContext;
  const username = 'tester@coregate.dev';

  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: 'http://localhost:9000',
    });

    await context.delete('/api/v1/testing/clear-user-data', {
      data: { username: username },
    });
  });

  test.afterAll(async () => {
    await context.delete('/api/v1/testing/clear-user-data', {
      data: { username: username },
    });
    await context.dispose();
  });
});
