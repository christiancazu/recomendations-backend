import {
  Controller,
  Get,
  Body,
  Response,
  Param,
  Put,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/role.decorator';
import { User } from './decorators/user.decorator';
import { RoleGuard } from './guards/role.guard';
import { RoleUser } from './enums/role-user.enum';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findByToken(@User('id') userId: string): Promise<IUser> {
    return this._usersService.findById(userId);
  }

  @Get()
  @Roles(RoleUser.ADMIN)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findAll(): Promise<IUser[]> {
    return this._usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id') id: string): Promise<IUser> {
    return this._usersService.findById(id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @User('id') userId: string,
    @Body() dto: UpdateUserDto,
    @Response() res,
  ): Promise<IUser> {
    const user = await this._usersService.update(userId, dto);
    const token = await this._authService.signPayload(user);

    return res.status(HttpStatus.OK).json({ user, token });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Response() res): Promise<string> {
    const message = await this._usersService.delete(id);

    return res.status(HttpStatus.OK).json({ message });
  }
}
