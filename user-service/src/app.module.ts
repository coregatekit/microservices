import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, HealthModule, DbModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
