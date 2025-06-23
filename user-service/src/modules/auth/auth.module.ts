import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [
    KeycloakModule,
    ConfigModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
