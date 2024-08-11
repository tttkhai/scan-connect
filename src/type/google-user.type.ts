export interface GoogleUser {
    provider: string;
    providerId: string;
    email: string;
    name: {
      givenName: string;
      familyName: string;
    };
    _accessToken: string;
    _refreshToken: string;
    picture: string;
}