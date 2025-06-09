import * as schema from '../../db/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UserResponse } from './users.interface';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const userExists = await this.db
      .select()
      .from(schema.users)
      .where(sql`${schema.users.email} = ${createUserDto.email}`);

    if (userExists.length > 0) {
      throw new Error('User already exists');
    }

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
