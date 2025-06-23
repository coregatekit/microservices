import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    HealthModule,
    DbModule,
    AuthModule,
    AddressesModule,
    KeycloakModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware for all routes
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
