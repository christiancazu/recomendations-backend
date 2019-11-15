import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IInterests } from './interfaces/iinterests.interface';
import { Model } from 'mongoose';
import { UpdateInterestsDto } from './dto/interests.dto';

@Injectable()
export class InterestsService {
  constructor(@InjectModel('Interests') private readonly _interestsModel: Model<IInterests>) { }

  /*
   ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
  ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
  ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
  ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
  */
  async create (userId: string, interests: UpdateInterestsDto): Promise<IInterests> {
    return await new this._interestsModel({ userId, interests}).save();
  }

  /*
  ███████╗██╗███╗   ██╗██████╗     ██████╗ ██╗   ██╗    ██╗██████╗
  ██╔════╝██║████╗  ██║██╔══██╗    ██╔══██╗╚██╗ ██╔╝    ██║██╔══██╗
  █████╗  ██║██╔██╗ ██║██║  ██║    ██████╔╝ ╚████╔╝     ██║██║  ██║
  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██╔══██╗  ╚██╔╝      ██║██║  ██║
  ██║     ██║██║ ╚████║██████╔╝    ██████╔╝   ██║       ██║██████╔╝
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═════╝    ╚═╝       ╚═╝╚═════╝
  */
  async findById (userId: string): Promise<IInterests> {
    try {
      return await this._interestsModel.findOne({ userId });
    } catch (error) {
      throw new NotFoundException('The user was not found');
    }
  }

  /*
  ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
  ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
  ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗
  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝
  ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
   ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
  */
  async update (userId: string, dto: UpdateInterestsDto): Promise<IInterests> {
    const userExits = await this.findById(userId);

    if (!userExits) {
      try {
        return await this.create(userId, dto)
      } 
      catch (error) {
          throw new UnprocessableEntityException(
        'No se pudo crear los interéses'
      );
      }
    }

    const userIdExits = userExits.userId

    try {
      await this._interestsModel
        .findOneAndUpdate({ userId: userIdExits }, { interests: dto })
        .exec();
      return await this.findById(userId)
    } 
    catch (error) {
      throw new UnprocessableEntityException(
        'No se pudo actualizar los interéses'
      );
    }
  }
}
