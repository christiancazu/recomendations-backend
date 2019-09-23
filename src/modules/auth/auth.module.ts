import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '../../config/config.service';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService, 
    ConfigService, 
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
