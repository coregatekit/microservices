import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { ConfigService } from '@nestjs/config';

describe('HealthController', () => {
  let controller: HealthController;
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return "OK" on health check', () => {
    mockConfigService.get.mockReturnValueOnce('user-service');
    mockConfigService.get.mockReturnValueOnce('1.0.0');
    expect(controller.healthCheck()).toBe(
      'Healthy user-service version: 1.0.0',
    );
  });
});
