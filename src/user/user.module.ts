import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService, QrCodeService, ConfigService, AwsS3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
