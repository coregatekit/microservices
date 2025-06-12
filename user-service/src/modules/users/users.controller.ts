import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UsersService } from './users.service';
import { UserResponse } from './users.interface';
import { Public } from '../../decorators/public';
import { HttpResponse } from '../../common/http-response';
import { ResultStatus } from '../../common/enum/result';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Public()
  @HttpCode(201)
  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<HttpResponse<UserResponse>> {
    try {
      return {
        status: ResultStatus.SUCCESS,
        message: 'User created successfully',
        data: await this.usersService.createUser(createUserDto),
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        status: ResultStatus.ERROR,
        message: 'Failed to create user',
      };
    }
  }

  @Get('me')
  getMe(): string {
    return 'This is the user profile endpoint';
  }
}
