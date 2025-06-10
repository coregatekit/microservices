import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { LoginResponse } from './auth';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
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

    return this.signToken({
      ['userId']: userExist.id,
      ['email']: userExist.email,
      ['name']: userExist.name,
    });
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }

  async signToken(data: Record<string, string> = {}): Promise<LoginResponse> {
    const payload = {
      sub: data['userId'],
      email: data['email'],
      name: data['name'],
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: 'mockRefreshToken', // Replace with actual refresh token logic if needed
    };
  }
}
