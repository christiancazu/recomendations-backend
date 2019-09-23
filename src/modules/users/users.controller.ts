import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Response, 
  Param, 
  Put, 
  Delete, 
  HttpStatus } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  findAll(): Promise<IUser[]> {
    return this._usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<IUser> {
    return this._usersService.create(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<IUser> {
    return this._usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<IUser> {
    return this._usersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Response() res): Promise<string> {
    const message = await this._usersService.delete(id);
    return res.status(HttpStatus.OK).json({ message });
  }
}
