import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [KeycloakModule, ConfigModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
