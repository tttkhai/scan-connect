import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ProfileDTO } from 'src/dto/profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() body: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userService.createUser(body);
    return newUser;
  }

  @Get('/user/:id')
  getUser(id: string): Promise<UserEntity> {
    return this.userService.findUser(id);
  }

  @Get('/profile/:id')
  getUserProfile(id: string): Promise<UserEntity | ProfileDTO> {
    return this.userService.findUserProfile(id);
  }
}
