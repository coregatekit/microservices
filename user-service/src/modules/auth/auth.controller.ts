import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public';
import { HttpResponse } from '../../common/http-response';
import { ResultStatus } from '../../common/enum/result';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<HttpResponse<LoginResponse>> {
    try {
      return {
        status: ResultStatus.SUCCESS,
        message: 'Login successful',
        data: await this.authService.login(
          loginRequest.email,
          loginRequest.password,
        ),
      };
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Loin failed';
      return {
        status: ResultStatus.ERROR,
        message: errorMessage,
      };
    }
  }
}
