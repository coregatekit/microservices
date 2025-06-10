import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UsersService } from './users.service';
import { UserResponse } from './users.interface';
import { Public } from '../../decorators/public';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Public()
  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('me')
  getMe(): string {
    return 'This is the user profile endpoint';
  }
}
