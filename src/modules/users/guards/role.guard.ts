import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersController } from '../users.controller';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasroles = () =>
      user.roles.some((role: string) => roles.includes(role));

    const isAuthorized: boolean = user && user.roles && hasroles();

    if (isAuthorized) return true;

    throw new UnauthorizedException();
  }
}
