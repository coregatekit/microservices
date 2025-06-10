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

  async login(email: string, password: string): Promise<LoginResponse> {
    const userExist = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!userExist) {
      throw new Error('User not found');
    }

    return {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
  }
}
