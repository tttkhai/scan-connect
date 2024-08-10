import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QrCodeService } from './qr-code/qr-code.service';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from "./config";
import { UserModule } from './user/user.module';
// import { AwsCognitoService } from './aws-cognito/cognito-guard.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, AwsS3Service], // , UserService, QrCodeService, AwsS3Service
})
export class AppModule {}
