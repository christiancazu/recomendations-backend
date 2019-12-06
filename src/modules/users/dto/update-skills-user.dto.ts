import {
  IsOptional,
} from 'class-validator';

export class UpdateSkillsUserDto {
  @IsOptional()
  readonly roles: [];
  @IsOptional()
  readonly skills: [];
  @IsOptional()
  readonly description: string;
}
