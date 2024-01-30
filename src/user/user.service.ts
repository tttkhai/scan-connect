import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { generateQrCode } from 'src/qr-code/qr-code.helper';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  repo: Repository<UserEntity>;
  constructor(
    repo: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    this.repo = repo;
  }

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.repo.create(body);
    // newUser.qrPath = await generateQrCode(
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

  async findUserProfile(id: string): Promise<UserEntity> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile.isPrivate) {
      return profile;
    }

    return profile;
  }
}
