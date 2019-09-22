import { IsNotEmpty, Length } from 'class-validator';
import { FieldUser } from '../enums/field-user.enum';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @Length(FieldUser.PASSWORD_MIN_LENGHT, FieldUser.PASSWORD_MAX_LENGHT)
  readonly password: string;
}
