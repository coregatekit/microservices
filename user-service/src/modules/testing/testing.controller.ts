import { Body, Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Public } from '../auth/auth.decorator';

@Controller('testing')
export class TestingController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Public()
  @Delete('clear-user-data')
  @HttpCode(HttpStatus.OK)
  async clearUserData(@Body() user: { username: string }) {
    return this.keycloakService.clearUserData(user.username);
  }
}
