import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { generateQrCode } from 'src/qr-code/qr-code.helper';

@Injectable()
export class UserService {
  async createUser(body: CreateUserDto): Promise<UserService> {

    const newUser = await ;
    newUser.qr_path = generateQrCode(process.env.SHORT_URL, {});
    return;
  }
}
