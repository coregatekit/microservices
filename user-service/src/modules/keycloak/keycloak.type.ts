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
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type UserInfoResponse = {
  sub: string;
  uid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type KeycloakUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  attributes: Record<string, string[]>;
  createdTimestamp: number;
  enabled: boolean;
  totp: boolean;
  disableableCredentialTypes: string[];
  requiredActions: string[];
  notBefore: number;
  access: {
    manage: boolean;
  };
};
