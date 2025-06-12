import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { DrizzleAsyncProvider } from '../../db/db.provider';

const mockDb = {
  insert: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
};

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
