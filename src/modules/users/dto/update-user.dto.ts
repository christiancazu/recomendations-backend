import { IsNotEmpty,  MaxLength, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { FieldUser } from '../enums/field-user.enum';

export class UpdateUserDto {
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

  @IsOptional()
  readonly status: string;
}
