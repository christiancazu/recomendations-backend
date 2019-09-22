import { IsNotEmpty, Length, MaxLength, IsEmail } from 'class-validator';
import { FieldUser } from '../enums/field-user.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(FieldUser.NAMES_MAX_LENGHT)
  readonly names: string;

  @IsNotEmpty()
  @MaxLength(FieldUser.SURNAMES_MAX_LENGHT)
  readonly surnames: string;

  @IsNotEmpty()
  @MaxLength(FieldUser.EMAIL_MAX_LENGHT)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(FieldUser.PASSWORD_MIN_LENGHT, FieldUser.PASSWORD_MAX_LENGHT)
  readonly password: string;
}
