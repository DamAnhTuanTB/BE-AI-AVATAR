import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './model/user.model';
import { UpdateInfoUserDto } from './dto/index.dto';
import { formatedResponse, handleError } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}
  //   {
  //   id: 'be5a400e-c4c7-44c6-a276-7a455eba5dc1',
  //   createdAt: '2023-09-20T06:14:04.992Z',
  //   updatedAt: '2023-09-20T06:14:04.992Z',
  //   deletedAt: null,
  //   firstName: 'JSBAsLig',
  //   lastName: 'gWPTTIYsxI',
  //   userName: 'CzvlMvOCojXzBXMQe',
  //   email: 'anhtuantb2422@gmail.com',
  //   isActive: true,
  //   activeAt: '2023-09-20T08:14:05.000Z',
  //   avatar: null,
  //   platform: 'handle',
  //   socialId: null,
  //   userType: 'ai-avatar',
  //   verifyToken: null
  // }

  async getDetailUser(userId: string) {
    try {
      const userDetail = await this.UserModel.findOne({ userId }).lean();
      return formatedResponse(userDetail);
    } catch (error: any) {
      handleError(error);
    }
  }

  async getProfile(user: any) {
    const userDetail = await this.UserModel.findOne({
      email: user.email,
    }).lean();
    if (userDetail) {
      await this.UserModel.updateOne(
        { email: user.email },
        { active: true, userId: user.id },
      );
    } else {
      await this.UserModel.create({
        userId: user.id,
        email: user.email,
        active: true,
      });
    }
    const detailUser = await this.UserModel.findOne({
      email: user.email,
    }).lean();
    return formatedResponse(detailUser);
  }

  async updateUserWhenPaymentSuccess(body: any) {
    const { email, priceInfo, userId } = body;
    const userByEmail = await this.UserModel.findOne({
      email: email?.toLowerCase,
    });
    const userByUserId = await this.UserModel.findOne({ userId });
    if (userByUserId) {
      const listGenerate = userByUserId.listGenerate;
      listGenerate.push({
        used: false,
        priority: listGenerate.length + 1,
        timePayment: new Date(),
        priceInfo,
      });
      await this.UserModel.updateOne({ userId }, { listGenerate });
    } else if (userByEmail) {
      const listGenerate = userByEmail.listGenerate;
      listGenerate.push({
        used: false,
        priority: listGenerate.length + 1,
        timePayment: new Date(),
        priceInfo,
      });
      await this.UserModel.updateOne({ email }, { listGenerate, userId });
    } else {
      await this.UserModel.create({
        userId,
        email: email?.toLowerCase,
        active: false,
        listGenerate: [
          {
            used: false,
            priority: 1,
            timePayment: new Date(),
            priceInfo,
          },
        ],
      });
    }
  }

  async updateInfoUser(userId: string, body: UpdateInfoUserDto) {
    await this.UserModel.updateOne({ userId }, body);
  }

  async checkUserExist(userId: string) {
    const user = await this.UserModel.findOne({ userId }).lean();

    if (user) {
      return {
        exists: user.active,
        email: user.email,
      };
    } else {
      return false;
    }
  }
}
