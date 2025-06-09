import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [UsersModule, HealthModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
