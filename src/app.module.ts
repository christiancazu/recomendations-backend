import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ConfigEnum } from './config/enums/config.enum';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { InterestsModule } from './modules/interests/interests.module';

@Module({
  imports: [
    ConfigModule, 
    DatabaseModule,
    SharedModule,
    AuthModule,
    UsersModule,
    InterestsModule
  ]
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(ConfigEnum.APP_PORT);
  }
}
