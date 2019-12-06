import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { IUsersService } from './interfaces/iusers.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSkillsUserDto } from './dto/update-skills-user.dto';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { IInterests } from '../interests/interfaces/iinterests.interface';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

const createKDTree = require("static-kdtree")

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<IUser>, 
    @InjectModel('Interests') private readonly _interestsModel: Model<IInterests>) {}

  /*
  ███████╗██╗███╗   ██╗██████╗      █████╗ ██╗     ██╗
  ██╔════╝██║████╗  ██║██╔══██╗    ██╔══██╗██║     ██║
  █████╗  ██║██╔██╗ ██║██║  ██║    ███████║██║     ██║
  ██╔══╝  ██║██║╚██╗██║██║  ██║    ██╔══██║██║     ██║
  ██║     ██║██║ ╚████║██████╔╝    ██║  ██║███████╗███████╗
  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═╝  ╚═╝╚══════╝╚══════╝
  */
  async findAll(): Promise<any> {
    const users = await this._userModel.find();
    return users.map(u => this.sanitizeUser(u));
  }

  async findAllExceptOne(userId: string): Promise<any> {
    const users = await this._userModel.find({ $and: [{ "_id": { $ne: userId } }, { "roles": ["tutor"] }]})
    return users.map(u => this.sanitizeUser(u));
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
      throw new UnprocessableEntityException({
          message: {
            email: 'El correo electrónico ya está en uso'
          }
        }
        // 'The email has already been taken',
      );
    }
    const createdUser = await new this._userModel(dto).save();
    return this.sanitizeUser(createdUser);
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
      return this.sanitizeUser(userExists);
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
  async findOne(options: object): Promise<IUser> {
    const userFound = await this._userModel.findOne({ email: options['email'] });
    return this.sanitizeUser(userFound) 
  }

  /*
  ███████╗██╗ ██████╗ ███╗   ██╗    ██╗███╗   ██╗
  ██╔════╝██║██╔════╝ ████╗  ██║    ██║████╗  ██║
  ███████╗██║██║  ███╗██╔██╗ ██║    ██║██╔██╗ ██║
  ╚════██║██║██║   ██║██║╚██╗██║    ██║██║╚██╗██║
  ███████║██║╚██████╔╝██║ ╚████║    ██║██║ ╚████║
  ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝╚═╝  ╚═══╝
  */
  async signIn(dto: CredentialsDto): Promise<IUser> {
    const userValid = await this._userModel.findOne({ email: dto.email });
    if (!userValid) {
      throw new UnprocessableEntityException({
        message: {
          email: 'El email no es válido'
        }
      })
    }
    if (await bcrypt.compare(dto.password, userValid['password'])) {
      return this.sanitizeUser(userValid);
    } else {
      throw new UnprocessableEntityException({
        message: {
          password: 'La contraseña es incorrecta'
        }
      });
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
  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    try {
      await this._userModel
        .findOneAndUpdate({ _id: id }, { ...dto, updatedAt: Date.now() })
        .exec();
      const userUpdated = await this.findById(id)
      return userUpdated;
    } catch (error) {
      throw new UnprocessableEntityException(
        'The email has already been taken',
      );
    }
  }

  /*
  ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
  ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
  ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ███████╗█████╔╝ ██║██║     ██║     ███████╗
  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
  ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ███████║██║  ██╗██║███████╗███████╗███████║
   ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
  */
  async updateSkills (id: string, dto: UpdateSkillsUserDto) {
    try {
      await this._userModel.findOneAndUpdate({ _id: id }, { ...dto, updatedAt: Date.now() })
    } catch (error) {
      throw new UnprocessableEntityException();
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
    const userDeleted = await this._userModel.findByIdAndRemove(id);
    if (!userDeleted) {
      throw new NotFoundException('The user was not found, can\'t be deleted');
    }
    return 'The user has been deleted succesfully';
  }


  /*
  ██████╗ ███████╗ ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
  ██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
  ██████╔╝█████╗  ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║██║  ██║███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
  ██╔══██╗██╔══╝  ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║  ██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
  ██║  ██║███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║██████╔╝██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
  */
  async recommendations (userId: string): Promise<any> {
    const userInterests: IInterests = await this._interestsModel.findOne({ userId }, { _id: 0 });
    const usersInterests: IInterests[] = await this._interestsModel.find({ "userId": { $ne: userId } }, { _id: 0 });

    const userInterestsValues: Number[] = this.interestsToArray(userInterests)
    const usersInterestsValues: Number[][] = []

    usersInterests.forEach(ui => {
      usersInterestsValues.push(this.interestsToArray(ui))
    })
    
    const recommendedIndexUsers = this.getUsersRecommended(userInterestsValues, usersInterestsValues)

    return usersInterests.filter((ui, index) => recommendedIndexUsers.includes(index)).map(u => ({ id: u.userId }))
  }

  interestsToArray ({ interests }: IInterests): Number[] {
    let interestsValues: Number[] = []

    Object.values(interests).forEach(interest => {      
      interestsValues.push(...Object.values(interest).map(({ value }) => Number(value)))
    })
    return interestsValues
  } 

  getUsersRecommended (userInterestsValues: Number[], usersInterestsValues: Number[][]): Number[] {
    const tree = createKDTree(usersInterestsValues)
    const recommendedIndexUsers = tree.knn(userInterestsValues, usersInterestsValues.length)
    tree.dispose()

    return recommendedIndexUsers
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
  private sanitizeUser(user: IUser): any {

    // const pw = bcrypt.

    const sanitized = user.toObject();
    sanitized['id'] = sanitized['_id']
    delete sanitized['_id'];
    delete sanitized['password'];
    delete sanitized['createdAt'];
    delete sanitized['updatedAt'];
    return sanitized;
  }
}
