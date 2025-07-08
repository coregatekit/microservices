import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Environment } from '../../utils/environment';

@ApiTags('Testing (Development Only)')
@Controller('testing')
export class TestingController {
  @Get()
  @ApiOperation({ summary: 'Get testing information' })
  @ApiResponse({ status: 200, description: 'Returns testing information' })
  getTestingInfo() {
    return {
      message: 'Testing endpoint is available - Development mode',
      timestamp: new Date().toISOString(),
      environment: Environment.current(),
      isDevelopment: Environment.isDevelopment(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Get testing health status' })
  @ApiResponse({ status: 200, description: 'Returns testing health status' })
  getTestingHealth() {
    return {
      status: 'ok',
      service: 'user-service',
      testing: true,
      environment: Environment.current(),
      uptime: process.uptime(),
    };
  }
}
