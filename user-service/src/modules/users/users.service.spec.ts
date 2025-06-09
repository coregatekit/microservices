import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        email: 'tester@example.com',
        password: 'securepassword',
        name: 'Test User',
        phone: '123-456-7890',
      };

      const result = await service.createUser(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
    });
  });
});
