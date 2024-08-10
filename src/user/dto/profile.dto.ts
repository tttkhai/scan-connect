export class ProfileDTO {
  readonly firstName: string;
  readonly lastName: string;
  readonly gender?: string;
  readonly birthday?: Date;
  readonly email?: string;
  readonly phone?: string;
  readonly website?: string;
  readonly title?: string;
  readonly qrPath: string;
  readonly avatarPath: string;
}
