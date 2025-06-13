import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public';
import { HttpResponse } from '../../common/http-response';
import { ResultStatus } from '../../common/enum/result';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;
  private readonly logger: Logger;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.logger = new Logger(AuthController.name);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<HttpResponse<LoginResponse>> {
    return {
      status: ResultStatus.SUCCESS,
      message: 'Login successful',
      data: await this.authService.login(
        loginRequest.email,
        loginRequest.password,
      ),
    };
  }
}
