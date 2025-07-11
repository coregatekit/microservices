import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UsersModule } from '../users/users.module';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [UsersModule, AddressesModule],
  controllers: [TestingController],
})
export class TestingModule {}
