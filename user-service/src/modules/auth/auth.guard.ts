import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Request } from 'express';
import { UserInfoResponse } from '../keycloak/keycloak.type';

// Extend the Express Request interface
declare module 'express' {
  interface Request {
    user?: UserInfoResponse;
    token?: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(private jwtService: JwtService) {
    this.logger = new Logger(AuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

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
