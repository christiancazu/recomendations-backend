import { UpdateInterestsDto } from '../dto/interests.dto';
import { IInterests } from './iinterests.interface';

export interface IUsersService {

  update (dto: UpdateInterestsDto): Promise<IInterests>;

}
