import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
