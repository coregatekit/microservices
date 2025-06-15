import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AddressesModule } from './modules/addresses/addresses.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
