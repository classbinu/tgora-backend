import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  grade: string;

  @IsString()
  password: string;

  @IsString()
  mentor: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  grade?: string;

  @IsString()
  nickname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;
}
