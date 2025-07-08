import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  controllers: [TestingController],
})
export class TestingModule {}
