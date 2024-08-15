import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "../type/user-payload.type";
import { AuthService } from "../auth.service";
import { cookieExtractor } from "./cookieExtractor";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
      ) {
        const cognitoAuthority = `https://cognito-idp.${configService.get<string>('AWS_REGION')}.amazonaws.com/${configService.get<string>('AWS_USER_POOL_ID')}`;
        
        super({
          secretOrKeyProvider: passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10,
            jwksUri: `${cognitoAuthority}/.well-known/jwks.json`,
          }),
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          issuer: `${cognitoAuthority}`,
          algorithms: ['RS256'],
        });
      }

  async validate(payload: UserPayload) {
    const cognitoUser = await this.authService.getUserByEmail(payload.username);
    const role = cognitoUser.UserAttributes.find(
      (attr) => attr.Name === "custom:role"
    );
    const user: UserPayload = {
      token_use: payload.token_use,
      username: payload.username,
      role: role.Value || "user",
      client_id: payload.client_id,
    };
    return user;
  }
}