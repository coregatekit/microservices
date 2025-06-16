import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // Set a timeout for HTTP requests
      maxRedirects: 5, // Set the maximum number of redirects
    }),
  ],
  providers: [KeycloakService],
})
export class KeycloakModule {}
