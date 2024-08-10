import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';

@Injectable()
export class CognitoGuard implements CanActivate {
  private verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    clientId: string;
    tokenUse: 'access';
  }>;

  constructor(private configService: ConfigService) {
    
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(this.configService.get<string>('COGNITO_USER_POOL_ID'));
    
    if (!this.configService.get('COGNITO_USER_POOL_ID')) {
      throw new Error('COGNITO_USER_POOL_ID environment variable was not set');
    }

    if (!this.configService.get('COGNITO_CLIENT_ID')) {
      throw new Error('COGNITO_CLIENT_ID environment variable was not set');
    }

    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      clientId: this.configService.get('COGNITO_CLIENT_ID'),
      tokenUse: 'access',
    });
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;
    if (!token) {
      return false;
    }

    try {
      const result = await this.verifier.verify(token);
      return !!result?.username;
    } catch (err) {
      return false;
    }
  }
}
