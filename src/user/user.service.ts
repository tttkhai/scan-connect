import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { getBucketName, getQrFolder } from 'src/app.constant';
import { CreateUserDTO } from './dto/create-user.dto';
import { ProfileDTO } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  repo: Repository<UserEntity>;
  constructor(
    @InjectRepository(UserEntity)
    repo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
  ) {
    this.repo = repo;
  }

  async createUser(body: CreateUserDTO): Promise<UserEntity> {
    const newUser = this.repo.create(body);
    newUser.qrPath = await this.qrCodeService.generateQrCode(
      this.configService.get<string>('SHORT_URL'),
      {
        bucket: getBucketName(),
        fileStorageLocation: `${getQrFolder()}/
        ${body.firstName}-
        ${body.lastName}-
        ${Date.now()}.png`,
      },
      { id: newUser.id, name: newUser.firstName },
    );

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
