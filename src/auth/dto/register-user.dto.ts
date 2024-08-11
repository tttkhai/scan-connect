import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    Matches,
    MinLength,
  } from "class-validator";
  
  export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsString()
    address?: string;
  
    @IsString()
    city?: string;
  
    @IsString()
    state?: string;
  
    @IsString()
    zip?: string;
  
    @IsString()
    country?: string;
  
    @IsPhoneNumber()
    phone?: string;
  
    @IsString()
    @MinLength(8)
    @Matches(/[a-z]/)
    @Matches(/[A-Z]/)
    @Matches(/[0-9]/)
    @IsNotEmpty()
    password: string;
  }