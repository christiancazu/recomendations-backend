import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IUsersService } from './interfaces/iusers.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectModel('User') private readonly _userModel: Model<IUser>) {}

  /*
  ███████╗██╗███╗   ██╗██████╗      █████╗ ██╗     ██╗
  ██╔════╝██║████╗  ██║██╔══██╗    ██╔══██╗██║     ██║
  █████╗  ██║██╔██╗ ██║██║  ██║    ███████║██║     ██║
  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██╔══██║██║     ██║
  ██║     ██║██║ ╚████║██████╔╝    ██║  ██║███████╗███████╗
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═╝  ╚═╝╚══════╝╚══════╝
  */

  async findAll(): Promise<IUser[]> {
    const users = await this._userModel.find();
    return users.map(u => this.sanitizeUserPassword(u));
  }

  /*
   ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
  ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
  ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
  ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
  */
  async create(dto: CreateUserDto): Promise<IUser> {
    const emailExists = await this._userModel.findOne({ email: dto.email });

    if (emailExists) {
      throw new UnprocessableEntityException(
        'The email has already been taken',
      );
    }
    const createdUser = await new this._userModel(dto).save();
    return this.sanitizeUserPassword(createdUser);
  }

  /*
  ███████╗██╗███╗   ██╗██████╗     ██████╗ ██╗   ██╗    ██╗██████╗
  ██╔════╝██║████╗  ██║██╔══██╗    ██╔══██╗╚██╗ ██╔╝    ██║██╔══██╗
  █████╗  ██║██╔██╗ ██║██║  ██║    ██████╔╝ ╚████╔╝     ██║██║  ██║
  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██╔══██╗  ╚██╔╝      ██║██║  ██║
  ██║     ██║██║ ╚████║██████╔╝    ██████╔╝   ██║       ██║██████╔╝
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═════╝    ╚═╝       ╚═╝╚═════╝
  */
  async findById(id: string): Promise<IUser> {
    try {
      const userExists = await this._userModel.findById(id);
      return this.sanitizeUserPassword(userExists);
    } catch (error) {
      throw new NotFoundException('The user was not found');
    }
  }

  /*
  ███████╗██╗███╗   ██╗██████╗      ██████╗ ███╗   ██╗███████╗
  ██╔════╝██║████╗  ██║██╔══██╗    ██╔═══██╗████╗  ██║██╔════╝
  █████╗  ██║██╔██╗ ██║██║  ██║    ██║   ██║██╔██╗ ██║█████╗
  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██║   ██║██║╚██╗██║██╔══╝
  ██║     ██║██║ ╚████║██████╔╝    ╚██████╔╝██║ ╚████║███████╗
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝
  */
  findOne(options: object): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  /*
  ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
  ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
  ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗
  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝
  ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
   ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
  */
  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    await this.findById(id);
    try {
      await this._userModel
        .findOneAndUpdate({ _id: id }, { ...dto, updatedAt: Date.now() })
        .exec();
      return this.findById(id)
    } catch (error) {
      throw new UnprocessableEntityException('The email has already been taken');
    }
  }

  /*
  ██████╗ ███████╗██╗     ███████╗████████╗███████╗
  ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
  ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
  ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
  ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
  ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
  */
  async delete(id: string): Promise<string> {
    const userDeleted = await this._userModel.findByIdAndRemove(id).exec();
    if (!userDeleted) {
      throw new NotFoundException('The user was not found, can\'t be deleted');
    }
    return 'The user has been deleted succesfully';
  }

  /*
  ███████╗ █████╗ ███╗   ██╗██╗████████╗██╗███████╗███████╗    ██╗   ██╗███████╗███████╗██████╗     ██████╗  █████╗ ███████╗███████╗██╗    ██╗ ██████╗ ██████╗ ██████╗
  ██╔════╝██╔══██╗████╗  ██║██║╚══██╔══╝██║╚══███╔╝██╔════╝    ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██╔════╝██╔════╝██║    ██║██╔═══██╗██╔══██╗██╔══██╗
  ███████╗███████║██╔██╗ ██║██║   ██║   ██║  ███╔╝ █████╗      ██║   ██║███████╗█████╗  ██████╔╝    ██████╔╝███████║███████╗███████╗██║ █╗ ██║██║   ██║██████╔╝██║  ██║
  ╚════██║██╔══██║██║╚██╗██║██║   ██║   ██║ ███╔╝  ██╔══╝      ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██╔═══╝ ██╔══██║╚════██║╚════██║██║███╗██║██║   ██║██╔══██╗██║  ██║
  ███████║██║  ██║██║ ╚████║██║   ██║   ██║███████╗███████╗    ╚██████╔╝███████║███████╗██║  ██║    ██║     ██║  ██║███████║███████║╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝
  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝
  */
  /**
   * deleting the field 'password' from object
   * returning the object without it
   *
   * @param user
   */
  private sanitizeUserPassword(user: IUser) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
