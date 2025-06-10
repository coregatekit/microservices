import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { LoginResponse } from './auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  login(email: string, password: string): LoginResponse {
    return {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
  }
}
