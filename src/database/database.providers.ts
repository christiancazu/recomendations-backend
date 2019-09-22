import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConfigEnum } from '../config/enums/config.enum';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (_configService: ConfigService) => ({
      uri: _configService.get(ConfigEnum.MONGO_URI),
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
  }),
];
