import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '../../config/config.service';
import { AuthService } from '../auth/auth.service';
import { InterestsSchema } from '../interests/schemas/interests.schema';
import { InterestsService } from '../interests/interests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Interests', schema: InterestsSchema }])
  ],
  providers: [
    UsersService, 
    ConfigService,
    AuthService,
    InterestsService
  ],
  controllers: [UsersController],
  exports: [UsersService]
})

export class UsersModule {}
