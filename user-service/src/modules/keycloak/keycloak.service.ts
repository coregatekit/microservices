import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
}
