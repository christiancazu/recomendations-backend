import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Response, 
  Param, 
  Put, 
  Delete, 
  HttpStatus, 
  UseGuards} from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/role.decorator';
import { User } from './decorators/user.decorator';
import { RoleGuard } from './guards/role.guard';
import { RoleUser } from './enums/role-user.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<IUser> {
    return this._usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Response() res): Promise<string> {
    const message = await this._usersService.delete(id);
    return res.status(HttpStatus.OK).json({ message });
  }
}
