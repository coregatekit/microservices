import { Body, Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../auth/auth.decorator';
import { UsersService } from '../users/users.service';
import { AddressesService } from '../addresses/addresses.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly userService: UsersService,
    private readonly addressService: AddressesService,
  ) {}

  @Public()
  @Delete('clear-user-data')
  @HttpCode(HttpStatus.OK)
  async clearUserData(@Body() user: { username: string }) {
    return this.userService.clearUserData(user.username);
  }

  @Public()
  @Delete('clear-all-user-addresses')
  @HttpCode(HttpStatus.OK)
  async clearAllUserAddresses(@Body() user: { username: string }) {
    return this.addressService.clearAllUserAddresses(user.username);
  }
}
