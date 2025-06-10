import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { LoginResponse } from './auth';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const userExist = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!userExist) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.verifyPassword(
      password,
      userExist.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }
}
