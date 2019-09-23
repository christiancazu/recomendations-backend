import {
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { FieldUser } from '../enums/field-user.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @MaxLength(FieldUser.NAMES_MAX_LENGHT)
  @IsOptional()
  readonly names: string;

  @IsNotEmpty()
  @MaxLength(FieldUser.SURNAMES_MAX_LENGHT)
  @IsOptional()
  readonly surnames: string;

  @IsNotEmpty()
  @MaxLength(FieldUser.EMAIL_MAX_LENGHT)
  @IsEmail()
  @IsOptional()
  readonly email: string;

}
