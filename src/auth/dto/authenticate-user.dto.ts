import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthenticateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}