import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger: Logger;

  constructor(private jwtService: JwtService) {
    this.logger = new Logger(AuthMiddleware.name);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = this.jwtService.extractToken(authHeader!);

      if (!token) {
        this.logger.warn('No token found in request headers');
        return next();
      }

      const decoded = await this.jwtService.validateToken(token);

      if (!decoded) {
        this.logger.warn('Invalid token');
        return next();
      }

      // Attach user information to the request object
      req['user'] = decoded;
      req['token'] = token;

      next();
    } catch (error: unknown) {
      this.logger.error(
        'Auth middware error: ',
        error instanceof Error ? error.message : 'Unknown error',
      );
      next();
    }
  }
}
