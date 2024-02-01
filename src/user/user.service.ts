import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProfileDTO } from 'src/dto/profile.dto';
import { QrCodeService } from 'src/qr-code/qr-code.service';

@Injectable()
export class UserService {
  repo: Repository<UserEntity>;
  constructor(
    repo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
  ) {
    this.repo = repo;
  }

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.repo.create(body);
    // newUser.qrPath = await this.qrCodeService.generateQrCode(
    //   this.configService.get<string>('SHORT_URL'),
    //   { id: newUser.id, name: newUser.firstName },
    // );
    this.repo.save(newUser);
    console.log(`newUser ${JSON.stringify(newUser)}`);

    return newUser;
  }

  async findUser(id: string): Promise<UserEntity> {
    return this.repo.findOne({ where: { id } });
  }

  async findUserProfile(id: string): Promise<UserEntity | ProfileDTO> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile.isPrivate) {
      return profile;
    }

    return this.repo.findOne({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        gender: true,
        birthday: true,
        email: true,
        phone: true,
        website: true,
        title: true,
        qrPath: true,
        avatarPath: true,
      },
    });
  }
}
