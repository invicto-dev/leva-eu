import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsString,
} from 'class-validator';
import { Role } from '@core/db';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;
}
