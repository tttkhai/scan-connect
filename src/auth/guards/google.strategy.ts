import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { GoogleUser } from "../type/google-user.type";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
      scope: ["profile", "email", "openid"],
      Proxy: true,
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user: GoogleUser = {
      provider: "google",
      providerId: id,
      email: emails[0].value,
      name,
      _accessToken,
      _refreshToken,
      picture: photos[0].value,
    };

    done(null, user);
  }
}