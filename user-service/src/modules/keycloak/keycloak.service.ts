import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakService {
  constructor(private configService: ConfigService) {}
}
