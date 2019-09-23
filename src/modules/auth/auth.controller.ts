import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('signIn')
  async signIn(@Body() dto: CredentialsDto): Promise<any> {
    const user = await this._usersService.signIn(dto);
    const token = await this._authService.signPayload(user);
    return { user, token };
  }

  @Post('signUp')
  async signUp(@Body() dto: CreateUserDto): Promise<IUser> {
    return await this._usersService.create(dto);
  }
}
