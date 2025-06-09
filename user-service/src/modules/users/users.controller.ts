import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UsersService } from './users.service';
import { UserResponse } from './users.interface';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.usersService.createUser(createUserDto);
  }
}
