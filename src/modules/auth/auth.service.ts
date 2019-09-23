import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { UsersService } from '../users/users.service';
import { ConfigEnum } from '../../config/enums/config.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _configService: ConfigService,
  ) {}

  async signPayload(payload: any) {
    return sign(
      payload, 
      this._configService.get(ConfigEnum.JWT_SECRET_KEY), 
      { expiresIn: '7d'}
    );
  }

  async validateUser(payload: any) {
    return await this._usersService.findOne(payload);
  }
}
