import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './users';

@Controller('users')
export class UsersController {
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto): string {
    console.log('Creating user with data:', createUserDto);
    return 'User created successfully';
  }
}
