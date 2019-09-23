import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '../../../config/config.service';
import { ConfigEnum } from '../../../config/enums/config.enum';
import { RoleUser } from '../enums/role-user.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  private jwtSecretKey: string;

  constructor(private readonly _configService: ConfigService) {
    this.jwtSecretKey = this._configService.get(ConfigEnum.JWT_SECRET_KEY);
  }

  canActivate(context: ExecutionContext) {
    const { headers } = context.switchToHttp().getRequest();

    const { roles }: any = verify(
      headers['authorization'].split(' ')[1],
      this.jwtSecretKey,
    );
    if (roles.find(r => r === RoleUser.ADMIN)) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
