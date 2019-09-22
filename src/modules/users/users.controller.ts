import { Controller, Get, Post, Body, Response, Param, Put, Delete, HttpStatus } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  findAll(): Promise<IUser[]> {
    return this._usersService.findAll();
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto): Promise<IUser> {
    return this._usersService.create(CreateUserDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<IUser> {
    return this._usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @User() dto: IUser): Promise<IUser> {
    console.log('user :', dto);
    return null;
    // return this._usersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Response() res): Promise<any> {
    const message = await this._usersService.delete(id);
    res.status(HttpStatus.OK).json({ message });
  }
}


  /*@Put(':id')
  update(@Param('id') id: string, @User() user: IUser): IUser {
    console.log('user :', user);
    return user;
    //return this._usersService.update(id, user);
  }*/