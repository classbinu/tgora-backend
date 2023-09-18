import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  mentor: string;
}

export class UpdateUserDto {
  @IsString()
  username?: string;

  @IsString()
  password?: string;

  @IsEmail()
  email?: string;

  @IsString()
  phone?: string;

  refreshToken?: string | null;
}
