import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Req,
    Request as RequestDecorator,
    Res,
    UseGuards,
  } from "@nestjs/common";
  import { AuthService } from "./auth.service";
  import { AuthenticateUserDto } from "./dto/authenticate-user.dto";
  import { Response, Request } from "express";
  import { CongnitoAuthGuard } from "./guards/cognito.guard";
  import { User } from "./type/user.type";
  import { Roles } from "./guards/roleGuard/roles.decorator";
  import { Role } from "./type/role.enum";
  import { RolesGuard } from "./guards/roleGuard/roles.guard";
  import { RegisterUserDto } from "./dto/register-user.dto";
  import { CognitoUser } from "amazon-cognito-identity-js";
  import { GoogleOauthGuard } from "./guards/google.guard";
  
  @Controller("auth")
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Get("google")
    @UseGuards(GoogleOauthGuard)
    async googleAuth(): Promise<void> {}

    @Get("google/callback")
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallback(
        @RequestDecorator() req: any,
        @Res() res: Response
    ): Promise<void> {
        const session = await this.authService.googleLogin(req.user);

        res.cookie("refresh_token", session.getRefreshToken().getToken(), {
        httpOnly: true,
        maxAge: 3600 * 1000 * 48, // 2 days
        path: "/",
        secure: true,
        sameSite: "none", 
        });
        res.cookie("access_token", session.getAccessToken().getJwtToken(), {
        httpOnly: true,
        maxAge: 3600 * 1000, // 1 hour in milliseconds
        path: "/",
        secure: true,
        sameSite: "none", 
        });
        res.redirect(process.env.FRONTEND_URL + "/");
    }

    @Post("register")
    @HttpCode(200)
    async registerUser(@Body() dto: RegisterUserDto): Promise<CognitoUser> {
      return await this.authService.registerUser(dto);
    }
  
    @Post("login")
    @HttpCode(200)
    async authenticateUser(
      @Body() dto: AuthenticateUserDto,
      @Res({ passthrough: true }) res: Response
    ): Promise<User> {
      const session = await this.authService.authenticateUser(dto);
      res.cookie("refresh_token", session.getRefreshToken().getToken(), {
        httpOnly: true,
        maxAge: 3600 * 1000 * 48, // 2 days
        path: "/",
        secure: true,
        sameSite: "none", 
      });
      res.cookie("access_token", session.getAccessToken().getJwtToken(), {
        httpOnly: true,
        maxAge: 3600 * 1000, // 1 hour in milliseconds
        path: "/",
        secure: true,
        sameSite: "none", 
      });
      return await this.authService.getUser(session);
    }
  
    @Post("refresh-token")
    @HttpCode(200)
    async refreshToken(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
    ): Promise<void> {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["refresh_token"];
      }
      const accessToken = await this.authService.refreshToken(token);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000, // 1 hour
        path: "/",
        secure: true,
        sameSite: "none", 
      });
    }
  
    @Post("logout")
    @HttpCode(200)
    @UseGuards(CongnitoAuthGuard, RolesGuard)
    // @Roles([Role.CUSTOMER]) : todo
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      await this.authService.logout(req.user["username"]);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
    }
  
}