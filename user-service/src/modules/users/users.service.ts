import * as schema from '../../db/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users';
import { UserResponse } from './users.interface';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as argon from 'argon2';

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

    const hashedPassword = await argon.hash(createUserDto.password);
    const result = await this.db
      .insert(schema.users)
      .values({
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        phone: createUserDto.phone,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        phone: schema.users.phone,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      });

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
