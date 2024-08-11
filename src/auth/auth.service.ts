import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { AuthenticateUserDto } from "./dto/authenticate-user.dto";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { User } from "../type/user.type";
import { Role } from "../type/role.enum";
import { LoginTypes } from "src/type/login-type.enum";
// import { UserEntity } from "src/entities/user.entity";
import { RegisterUserDto } from "./dto/register-user.dto";
import { GoogleUser } from "../type/google-user.type";
import { generatePassword } from "src/utils/password-generator";
import SimpleCrypto from "simple-crypto-js";
import axios from "axios";
import { UserEntity } from "src/user/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  private readonly cognitoProvider: CognitoIdentityServiceProvider;
  private clientID: string;
  private userPoolId: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource
  ) {
    this.clientID = this.configService.get("AWS_CLIENT_ID");
    this.userPoolId = this.configService.get("AWS_USER_POOL_ID");
    this.userPool = new CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.clientID,
    });
    this.cognitoProvider = new CognitoIdentityServiceProvider({
      region: this.configService.get("AWS_REGION"),
    });
  }

  async googleLogin(user: GoogleUser): Promise<CognitoUserSession> {
    const { _accessToken, email } = user;
    let password: string;

    try {
      const simpleCrypto = new SimpleCrypto(this.configService.get("APP_SECRET"));

      if (await this.isTokenExpired(_accessToken)) {
        throw new HttpException("Token is expired", HttpStatus.UNAUTHORIZED);
      }

      const user = await this.userRepo.findOne({
        where: { email: email },
      });

      if (user && user.loginType === LoginTypes.MANUAL) {
        throw new HttpException(
          "This email previously registered with email and password, Please login with your password",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!user) {
        password = generatePassword();
        const encryptedPassword = simpleCrypto.encrypt(password);

        await this.dataSource.manager.transaction(
          async (transactionalEntityManager) => {
            const cognitoUser = await this.createCognitoUser(
              email,
              password,
              true
            );


            await transactionalEntityManager.save(UserEntity, {
              email,
              firstName: user.firstName,
              lastName: user.lastName,
              loginType: LoginTypes.GOOGLE,
              password: encryptedPassword,
            });
            return cognitoUser;
          }
        );
      } else {
        password = simpleCrypto.decrypt(user.password).toString();
      }

      const session = await this.UserSignIn(email, password);
      return session;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }

      return false;
    } catch (error) {
      return true;
    }
  }

  async UserSignIn(
    username: string,
    password: string
  ): Promise<CognitoUserSession> {
    try {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const userData = {
        Username: username,
        Pool: this.userPool,
      };

      const newUser = new CognitoUser(userData);

      const session = await new Promise<CognitoUserSession>(
        (resolve, reject) => {
          newUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
              resolve(result);
            },
            onFailure: (error) => {
              reject(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
            },
            newPasswordRequired: () => {
              reject(
                new HttpException(
                  "Password reset is required",
                  HttpStatus.UNAUTHORIZED
                )
              );
            },
          });
        }
      );
      return session;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async registerUser(dto: RegisterUserDto): Promise<CognitoUser> {
    try {
      const user = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (user) {
        throw new HttpException(
          "User with this email already exists",
          HttpStatus.BAD_REQUEST
        );
      }
      const newUser = await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          const cognitoUser = await this.createCognitoUser(
            dto.email,
            dto.password
          );

          await transactionalEntityManager.save(UserEntity, {
            ...dto,
            loginType: LoginTypes.MANUAL,
          });

          return cognitoUser;
        }
      );
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async createCognitoUser(
    email: string,
    password: string,
    isGoogleLogin = false
  ): Promise<CognitoUser> {
    try {
      return new Promise((resolve, reject) => {
        return this.userPool.signUp(
          email,
          password,
          [
            new CognitoUserAttribute({
              Name: "custom:role",
              Value: Role.USER,
            }),
            new CognitoUserAttribute({ Name: "email", Value: email }),
            new CognitoUserAttribute({
              Name: "custom:login",
              Value: isGoogleLogin ? "google" : "manual",
            }),
          ],

          null,
          (err, result) => {
            if (!result) {
              reject(err);
            } else {
              resolve(result.user);
            }
          }
        );
      });
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }


  async authenticateUser(
    user: AuthenticateUserDto
  ): Promise<CognitoUserSession> {
    const { email, password } = user;
    
    try {
      const user = await this.userRepo.findOne({
        where: { email: email },
      });
      if (user.loginType === LoginTypes.GOOGLE) {
        throw new HttpException(
          "This email previously registered with google, Please login with google",
          HttpStatus.BAD_REQUEST
        );
      }
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      const userData = {
        Username: email,
        Pool: this.userPool,
      };
      const newUser = new CognitoUser(userData);

      return new Promise<CognitoUserSession>((resolve, reject) => {
        newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (error) => {
            reject(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
          },
          newPasswordRequired: () => {
            reject(
              new HttpException(
                "Password reset is required",
                HttpStatus.UNAUTHORIZED
              )
            );
          },
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  async getUser(session: CognitoUserSession): Promise<User> {
    try {
      const payload = session.getIdToken().payload;
      const email = payload.email;
      const role = payload["custom:role"];
      if (!email) {
        throw new HttpException("Email is required", HttpStatus.NOT_FOUND);
      }
      if (!role) {
        throw new HttpException("Role is required", HttpStatus.NOT_FOUND);
      }
      let userEntity: UserEntity;
      // Find user for role
      userEntity = await this.userRepo.findOne({
        where: { email: email },
      });
      if (!userEntity) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      const user: User = {
        email,
        role,
        id: +userEntity.id,
      };

      return user;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 401);
    }
  }

  async refreshToken(token: string): Promise<string> {
    if (!token) {
      throw new HttpException("Token is required", HttpStatus.BAD_REQUEST);
    }
    try {
      const params = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: this.clientID,
        AuthParameters: {
          REFRESH_TOKEN: token,
        },
      };
      const result = await this.cognitoProvider.initiateAuth(params).promise();
      const accessToken = result.AuthenticationResult.AccessToken;
      return accessToken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(userName: string) {
    try {
      const params: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutRequest =
        {
          UserPoolId: this.userPoolId,
          Username: userName,
        };
      await this.cognitoProvider.adminUserGlobalSignOut(params).promise();
    } catch (error) {
      throw new HttpException(`Failed to logout: ${error.message}`, 400);
    }
  }

  async getUserByEmail(
    email: string
  ): Promise<CognitoIdentityServiceProvider.Types.AdminGetUserResponse> {
    try {
      const params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest = {
        UserPoolId: this.userPoolId,
        Username: email,
      };
      return await this.cognitoProvider.adminGetUser(params).promise();
    } catch (error) {
      throw new HttpException(
        `Failed to get user by email: ${error.message}`,
        400
      );
    }
  }
}