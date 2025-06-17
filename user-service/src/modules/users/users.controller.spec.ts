import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './users';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    registerUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'john@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockUser = {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a user successfully', async () => {
      mockUsersService.registerUser.mockResolvedValue(mockUser);

      const result = await controller.createUser(createUserDto);

      expect(result.data).toEqual(mockUser);
      expect(mockUsersService.registerUser).toHaveBeenCalledWith(createUserDto);
      expect(mockUsersService.registerUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user creation fails', async () => {
      const errorMessage = 'User creation failed';
      mockUsersService.registerUser.mockRejectedValue(new Error(errorMessage));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        errorMessage,
      );
      expect(mockUsersService.registerUser).toHaveBeenCalledWith(createUserDto);
      expect(mockUsersService.registerUser).toHaveBeenCalledTimes(1);
    });
  });
});
