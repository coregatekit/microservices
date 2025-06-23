import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/auth.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Public()
  @Get()
  healthCheck(): string {
    return `Healthy ${this.configService.get<string>('APP_NAME')} version: ${this.configService.get<string>('APP_VERSION')}`;
  }
}
