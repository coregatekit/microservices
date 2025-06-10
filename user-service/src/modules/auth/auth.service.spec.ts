import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';

const mockDb = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
