import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
