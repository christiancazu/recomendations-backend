import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '../../config/config.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [
    UsersService, 
    ConfigService,
    AuthService
  ],
  controllers: [UsersController],
  exports: [UsersService],
})

export class UsersModule {}
