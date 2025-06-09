import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UserResponse } from './users.interface';

@Injectable()
export class UsersService {
  createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const userResponse: UserResponse = {
      id: '1',
      email: createUserDto.email,
      name: createUserDto.name,
      phone: createUserDto.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return Promise.resolve(userResponse);
  }
}
