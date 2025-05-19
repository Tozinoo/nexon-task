import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, Role } from '../schemas/user.schema';


// 초기 실행 시 기존 사용자 삭제 후 roles 유저들 데이터 생성
@Injectable()
export class UserSeederService implements OnModuleInit {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    await this.userModel.deleteMany({});

    const defaultPassword = 'Password123!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const roles = [
      Role.USER,
      Role.OPERATOR,
      Role.AUDITOR,
      Role.ADMIN,
    ];
    const users = roles.map((role) => ({
      username: role.toLowerCase(),
      passwordHash,
      role: role,
    }));


    await this.userModel.insertMany(users);

    this.logger.log(`user roles: ${roles.join(', ')}`);
  }
}
