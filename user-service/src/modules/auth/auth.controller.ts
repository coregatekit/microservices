import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() loginRequest: LoginRequest): LoginResponse {
    console.log('Login request received:', loginRequest);

    return {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
  }
}
