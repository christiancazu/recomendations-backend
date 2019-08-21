import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConfigKeys } from '../config/config.keys';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (_configService: ConfigService) => ({
      uri: _configService.get(ConfigKeys.MONGO_URI),
      useNewUrlParser: true,
    }),
  }),
];
