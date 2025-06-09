import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './users';

const mockUsersService = {
  createUser: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'john@example.com',
        password: 'password',
        name: 'John Doe',
      };
      usersService.createUser = jest.fn().mockResolvedValue({
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name,
        phone: createUserDto.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.createUser(createUserDto);

      expect(result.id).toBeDefined();
      expect(result.email).toBe('john@example.com');
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        password: 'password',
        name: 'John Doe',
      };
      usersService.createUser = jest
        .fn()
        .mockRejectedValue(new Error('User creation failed'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        'User creation failed',
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});
