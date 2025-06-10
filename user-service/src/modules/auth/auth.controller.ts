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
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(
      loginRequest.email,
      loginRequest.password,
    );
  }
}
