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
import { DataMasker } from '../../common/data-mask';

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
  @Post('legacy/login')
  async legacyLogin(
    @Body() loginRequest: LoginRequest,
  ): Promise<HttpResponse<LoginResponse>> {
    this.logger.log(
      `Login attempt for user with email: ${DataMasker.mask(loginRequest.email)}`,
    );
    return {
      status: ResultStatus.SUCCESS,
      message: 'Login successful',
      data: await this.authService.legacyLogin(
        loginRequest.email,
        loginRequest.password,
      ),
    };
  }
}
