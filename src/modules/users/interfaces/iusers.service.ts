import { IUser } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  findOne(options: object): Promise<IUser | null>;

  update(id: string, dto: UpdateUserDto): Promise<IUser | null>;

  delete(id: string): Promise<string>;
}
