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

  async findAll(): Promise<IUser[]> {
    const users = await this._userModel.find();
    return users.map(u => this.sanitizeUser(u));
  }

  async create(dto: CreateUserDto): Promise<IUser> {
    const emailExists = await this._userModel.findOne({ email: dto.email });

    if (emailExists) {
      throw new UnprocessableEntityException('user already exists');
    }
    const createdUser = new this._userModel(dto);
    return await createdUser.save();
  }

  async findById(id: string): Promise<IUser> {
    try {
      const userExists = await this._userModel.findById(id).exec();
      return this.sanitizeUser(userExists);
    } catch (error) {
      throw new NotFoundException('user not found');
    }
  }

  findOne(options: object): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    await this.findById(id);
    try {
      await this._userModel.findOneAndUpdate(id, { ...dto, updateAt: Date.now }).exec();
      return await this.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException('email is already taken');
    }
  }

  async delete(id: string): Promise<string> {
    const userDeleted = await this._userModel.findByIdAndRemove(id).exec();
    if(!userDeleted) {
      throw new NotFoundException('user not found');
    }
    return 'The user has been deleted';
  }

  private sanitizeUser(user: IUser) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
