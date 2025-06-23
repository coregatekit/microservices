import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './users';
import { UsersService } from './users.service';
import { UserResponse } from './users.interface';
import { HttpResponse } from '../../common/http-response';
import { ResultStatus } from '../../common/enum/result';
import { DataMasker } from '../../common/data-mask';
import { Public } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;
  private readonly logger: Logger;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
    this.logger = new Logger(UsersController.name);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<HttpResponse<UserResponse>> {
    this.logger.log(
      `Incoming request to create user: ${DataMasker.mask(createUserDto.email)}`,
    );
    return {
      status: ResultStatus.SUCCESS,
      message: 'User created successfully',
      data: await this.usersService.registerUser(createUserDto),
    };
  }
}
