import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ConfigEnum } from './config/enums/config.enum';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule, 
    DatabaseModule, 
    UsersModule
  ]
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(ConfigEnum.APP_PORT);
  }
}
