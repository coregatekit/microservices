import { Body, Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../auth/auth.decorator';
import { UsersService } from '../users/users.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Delete('clear-user-data')
  @HttpCode(HttpStatus.OK)
  async clearUserData(@Body() user: { username: string }) {
    return this.userService.clearUserData(user.username);
  }
}
