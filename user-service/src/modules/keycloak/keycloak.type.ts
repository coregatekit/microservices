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

export type KeycloakLoginResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  tokenType: string;
  idToken: string;
  notBeforePolicy: number;
  sessionState: string;
  scope: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
