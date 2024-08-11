import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./guards/jwt.strategy";
import { CongnitoAuthGuard } from "./guards/cognito.guard";
import { UserEntity } from "src/user/user.entity";
import { GoogleStrategy } from "./guards/google.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, CongnitoAuthGuard],
  exports: [AuthService, CongnitoAuthGuard],
})
export class AuthModule {}