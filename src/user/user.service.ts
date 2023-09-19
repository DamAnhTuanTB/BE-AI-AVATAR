import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './model/user.model';
import { UpdateInfoUserDto } from './dto/index.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}
  async updateUserWhenPaymentSuccess(body: any) {
    const { email, priceInfo, userId } = body;
    if (userId !== 'undefined') {
      const user = await this.UserModel.findOne({ userId });
      const listGenerate = user.listGenerate;
      listGenerate.push({
        used: false,
        priority: listGenerate.length + 1,
        timePayment: new Date(),
        priceInfo,
      });
      await this.UserModel.updateOne({ userId }, { listGenerate });
    } else {
      const user: any = await this.UserModel.findOne({ email }).lean();
      if (user) {
        const listGenerate = user.listGenerate;
        listGenerate.push({
          used: false,
          priority: listGenerate.length + 1,
          timePayment: new Date(),
          priceInfo,
        });
        await this.UserModel.updateOne({ email: body.email }, { listGenerate });
      } else {
        await this.UserModel.create({
          email: body.email,
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
  }

  async updateInfoUser(userId: string, body: UpdateInfoUserDto) {
    await this.UserModel.updateOne({ userId }, { body });
  }
}
