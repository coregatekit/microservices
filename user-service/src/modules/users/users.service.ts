import * as schema from '../../db/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UserResponse } from './users.interface';
import { DrizzleAsyncProvider } from 'src/db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

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
