import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { LoginRequest } from './auth';
import { AuthService } from './auth.service';
import { HttpResponse } from '../../common/http-response';
import { ResultStatus } from '../../common/enum/result';
import { DataMasker } from '../../common/data-mask';
import { LoginResponse } from './auth.type';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;
  private readonly logger: Logger;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.logger = new Logger(AuthController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<HttpResponse<LoginResponse>> {
    this.logger.log(
      `Login attempt for user with email: ${DataMasker.mask(loginRequest.email)}`,
    );
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
