import { 
  Controller, 
  Post, 
  Body, 
  Response, 
  HttpStatus } from '@nestjs/common';
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
  async signIn(@Body() dto: CredentialsDto, @Response() res): Promise<any> {
    const user = await this._usersService.signIn(dto);

    let userAsPayload = {}

    Object.keys(user).forEach(key => {
      if (key !== 'languages') userAsPayload[key] = user[key]
    });

    const token = await this._authService.signPayload(userAsPayload);
    return res.status(HttpStatus.OK).json({ user, token });
  }

  @Post('signUp')
  async signUp(@Body() dto: CreateUserDto): Promise<IUser> {
    return await this._usersService.create(dto);
  }
}
