import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CognitoGuard } from 'src/aws-cognito/cognito-guard.service';
import { CurrentUser } from './user';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { getBucketName, getQrFolder } from 'src/app.constant';
import { CreateUserDTO } from './dto/create-user.dto';
import { ProfileDTO } from './dto/profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post('/signup')
  signUp(@Body() body: CreateUserDTO): Promise<UserEntity> {
    const newUser = this.userService.createUser(body);
    return newUser;
  }

  @Get('/user/:id')
  @UseGuards(CognitoGuard)
  getUser(id: string, @CurrentUser() currentUser): Promise<UserEntity> {
    return this.userService.findUser(id);
  }

  @Get('/profile/:id')
  getUserProfile(id: string): Promise<UserEntity | ProfileDTO> {
    console.log("hello");
    
    return this.userService.findUserProfile(id);
  }

  @Post('/upload')
  upload() {
    this.awsS3Service.generatePresignedUrl(getBucketName(), getQrFolder());
  }
}
