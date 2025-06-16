export type AccessTokenResponse = {
  access_token: string;
};

export type CreateKeycloakUserRequest = {
  enabled: boolean;
  email: string;
  firstName: string;
  lastName: string;
  credentials: Array<{
    type: string;
    value: string;
    temporary?: boolean;
  }>;
  attributes?: Record<string, string>;
};
