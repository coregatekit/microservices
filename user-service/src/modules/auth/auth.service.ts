import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import * as schema from '../../db/drizzle/schema';
import { LoginResponse } from './auth';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataMasker } from '../../common/data-mask';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    this.logger.log(
      `Checking credentials for user with email: ${DataMasker.mask(email)}`,
    );
    const userExist = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!userExist) {
      this.logger.warn(`User with email ${DataMasker.mask(email)} not found`);
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.verifyPassword(
      password,
      userExist.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `Invalid password for user with email ${DataMasker.mask(email)}`,
      );
      throw new UnauthorizedException('Invalid password');
    }

    this.logger.log(
      `Password verified for user with email: ${DataMasker.mask(email)}`,
    );
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
    this.logger.log(`Verifying password...`);
    return await argon.verify(hashedPassword, password);
  }

  async signToken(data: Record<string, string> = {}): Promise<LoginResponse> {
    this.logger.log('Signing token for user');
    const payload = {
      sub: data['userId'],
      email: data['email'],
      name: data['name'],
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME', '1h'),
        audience: this.configService.get<string>('JWT_AUDIENCE', 'users'),
        issuer: this.configService.get<string>('JWT_ISSUER', 'auth-service'),
      }),
      refreshToken: 'mockRefreshToken', // Replace with actual refresh token logic if needed
    };
  }
}
