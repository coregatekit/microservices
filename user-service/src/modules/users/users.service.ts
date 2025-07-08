import * as schema from '../../db/drizzle/schema';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './users';
import { UserResponse } from './users.interface';
import { DrizzleAsyncProvider } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { DataMasker } from '../../common/data-mask';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Environment } from '../../utils/environment';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    @Inject(KeycloakService)
    private readonly keycloakService: KeycloakService,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  // async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
  //   this.logger.log(
  //     `Creating user with email: ${DataMasker.mask(createUserDto.email)}`,
  //   );
  //   const userExists = await this.db
  //     .select()
  //     .from(schema.users)
  //     .where(sql`${schema.users.email} = ${createUserDto.email}`);

  //   if (userExists.length > 0) {
  //     this.logger.warn(
  //       `User with email ${DataMasker.mask(createUserDto.email)} already exists`,
  //     );
  //     throw new ConflictException('User already exists');
  //   }

  //   this.logger.log(
  //     `Hashing password for user: ${DataMasker.mask(createUserDto.email)}`,
  //   );
  //   const hashedPassword = await argon.hash(createUserDto.password);

  //   this.logger.log(
  //     `Inserting new user into database: ${DataMasker.mask(createUserDto.email)}`,
  //   );
  //   const result = await this.db
  //     .insert(schema.users)
  //     .values({
  //       email: createUserDto.email,
  //       password: hashedPassword,
  //       name: createUserDto.name,
  //       phone: createUserDto.phone,
  //     })
  //     .returning({
  //       id: schema.users.id,
  //       email: schema.users.email,
  //       name: schema.users.name,
  //       phone: schema.users.phone,
  //       createdAt: schema.users.createdAt,
  //       updatedAt: schema.users.updatedAt,
  //     });

  //   this.logger.log(`User created successfully with ID: ${result[0].id}`);
  //   return {
  //     id: result[0].id,
  //     email: result[0].email,
  //     name: result[0].name,
  //     phone: result[0].phone || undefined,
  //     createdAt: new Date(result[0].createdAt),
  //     updatedAt: new Date(result[0].updatedAt),
  //   };
  // }

  async registerUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.log(
      `Creating user with email: ${DataMasker.mask(createUserDto.email)}`,
    );
    const userExists = await this.db
      .select()
      .from(schema.users)
      .where(sql`${schema.users.email} = ${createUserDto.email}`);

    if (userExists.length > 0) {
      this.logger.warn(
        `User with email ${DataMasker.mask(createUserDto.email)} already exists`,
      );
      throw new ConflictException('User already exists');
    }

    this.logger.log(
      `Inserting new user into database: ${DataMasker.mask(createUserDto.email)}`,
    );
    const result = await this.db
      .insert(schema.users)
      .values({
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        phone: schema.users.phone,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      });

    this.logger.log(
      `Registering user in Keycloak: ${DataMasker.mask(createUserDto.email)}`,
    );
    await this.keycloakService.createUser({
      uid: result[0].id,
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });

    this.logger.log(`User created successfully with ID: ${result[0].id}`);
    return {
      id: result[0].id,
      email: result[0].email,
      firstName: result[0].firstName,
      lastName: result[0].lastName,
      phone: result[0].phone || undefined,
      createdAt: new Date(result[0].createdAt),
      updatedAt: new Date(result[0].updatedAt),
    };
  }

  async clearUserData(username: string): Promise<void> {
    try {
      if (Environment.isProduction()) {
        this.logger.warn(
          'Attempted to clear user data in production environment. Operation aborted.',
        );
        throw new Error('Cannot clear user data in production environment');
      }

      this.logger.log(`Clearing user data for username: ${username}`);
      const result = await this.db
        .delete(schema.users)
        .where(sql`${schema.users.email} = ${username}`);

      if (result.rowCount === 0) {
        this.logger.warn(`No user found with username: ${username}`);
        throw new NotFoundException(`User with username ${username} not found`);
      }

      await this.keycloakService.clearUserData(username);
      this.logger.log(`User data cleared for username: ${username}`);
    } catch (error) {
      this.logger.error(
        `Failed to clear user data for username: ${username}`,
        error,
      );
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to clear user data for username: ${username}. Error: ${error.message}`,
      );
    }
  }
}
