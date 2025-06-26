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
import { Public } from './auth.decorator';

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
    this.logger.log(
      `Incoming login request for user with email: ${DataMasker.mask(loginRequest.email)}`,
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

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Body('refreshToken') refreshToken: string,
  ): Promise<HttpResponse<{ success: boolean; message: string }>> {
    this.logger.log('Incoming logout request');

    const result = await this.authService.logout(refreshToken);

    if (!result.success) {
      this.logger.error('Logout failed: No result returned');
      return {
        status: ResultStatus.ERROR,
        message: 'Logout failed',
      };
    }

    return {
      status: ResultStatus.SUCCESS,
      message: 'Logout successful',
    };
  }
}
