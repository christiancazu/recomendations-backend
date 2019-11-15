import { Controller, Put, UseGuards, Body, Response, HttpStatus, Get } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateInterestsDto } from './dto/interests.dto';
import { IInterests } from './interfaces/iinterests.interface';
import { User } from '../users/decorators/user.decorator';

@Controller('interests')
export class InterestsController {
  constructor(
    private readonly _interestsService: InterestsService,
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findById (@User('id') userId: string): Promise<IInterests> {
    return this._interestsService.findById(userId);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async update (
    @User('id') userId: string,
    @Body() dto: UpdateInterestsDto
  ): Promise<IInterests> {
    return this._interestsService.update(userId, dto)
  }
}
