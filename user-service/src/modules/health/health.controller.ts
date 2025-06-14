import { Controller, Get } from '@nestjs/common';
import { Public } from '../../decorators/public';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Public()
  @Get()
  healthCheck(): string {
    return `Healthy ${this.configService.get<string>('APP_NAME')} version: ${this.configService.get<string>('APP_VERSION')}`;
  }
}
