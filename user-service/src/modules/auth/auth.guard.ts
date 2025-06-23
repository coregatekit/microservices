import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    this.logger = new Logger(AuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (request.user) {
      this.logger.debug('User already authenticated', request.user.uid);
      return true;
    }

    const authHeader = request.headers.authorization;
    const token = this.jwtService.extractToken(authHeader!);

    if (!token) {
      this.logger.warn('No token found in request headers');
      throw new UnauthorizedException('Authorization token is required');
    }

    const user = await this.jwtService.validateToken(token);

    if (!user) {
      this.logger.warn('Invalid token');
      throw new UnauthorizedException('Invalid authorization token');
    }

    request.user = user;
    request.token = token;

    return true;
  }
}
