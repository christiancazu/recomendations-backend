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
import { AdminGuard } from './guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
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
