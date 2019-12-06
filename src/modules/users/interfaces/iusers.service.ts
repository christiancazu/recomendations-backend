import { IUser } from './user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IBaseService } from '../../shared/interfaces/ibase.service';
import { CredentialsDto } from '../../../modules/auth/dto/credentials.dto';

export interface IUsersService extends IBaseService<IUser, CreateUserDto, UpdateUserDto> {

  signIn(dto: CredentialsDto): Promise<IUser>;
  
  findAllExceptOne (userId: string): Promise<any>;

}
