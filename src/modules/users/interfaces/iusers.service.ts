import { IUser } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IBaseService } from '../../shared/interfaces/ibase.service';

export interface IUsersService extends IBaseService<IUser, CreateUserDto, UpdateUserDto> {}
