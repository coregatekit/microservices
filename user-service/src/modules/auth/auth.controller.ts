import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('login')
  login(@Body() loginRequest: LoginRequest): LoginResponse {
    console.log('Login request received:', loginRequest);

    return {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
  }
}
