import { Request } from 'express';
import { UserInfoResponse } from 'src/modules/keycloak/keycloak.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserInfoResponse;
      token?: string;
    }
  }
}
