import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from 'src/db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from './constants';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      global: true,
      secret: SECRET,
      signOptions: { expiresIn: '1h' }, // Adjust the expiration time as needed
      verifyOptions: { algorithms: ['HS256'] }, // Ensure the algorithm matches your signing
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
