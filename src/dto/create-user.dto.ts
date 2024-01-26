import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly lastName: string;
  readonly gender: string;
  readonly birthday: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly website: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly isPrivate: boolean;
}
