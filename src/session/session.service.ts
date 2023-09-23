import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatedResponse, handleError } from 'src/utils';
import { SessionDocument } from './model/session.model';
import {
  CreateSessionDto,
  QueryDownloadAllAvatarWithStyleDto,
} from './dto/index.dto';
import * as archiver from 'archiver';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UpdateInfoUserDto } from 'src/user/dto/index.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session')
    private readonly SessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async createSession(body: CreateSessionDto, userId: string) {
    const userDetail = await this.userService.getDetailUser(userId);
    const listGenerate = userDetail.listGenerate;
    listGenerate.forEach((item: any, index: number) => {
      // console.log(
      //   new Date(item.timePayment).toISOString(),
      //   new Date(body.timePayment).toISOString(),
      //   new Date(item.timePayment).toISOString() ===
      //     new Date(body.timePayment).toISOString(),
      // );
      if (
        new Date(item.timePayment).toISOString() ===
        new Date(body.timePayment).toISOString()
      ) {
        listGenerate[index].used = true;
      }
    });

    await this.userService.updateInfoUser(userId, {
      listGenerate,
    } as UpdateInfoUserDto);

    return this.SessionModel.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      originFirstImage:
        this.configService.get('AWS.CDN') + '/' + body.originFirstImage,
    });
  }

  async getDetailSession(sessionId: string) {
    const sessionDetail = await this.SessionModel.findOne({ sessionId }).lean();
    return formatedResponse(sessionDetail);
  }

  async updateSession(sessionId: string, payload: any) {
    await this.SessionModel.updateOne({ sessionId }, payload);
  }

  async downloadResult(sessionId: string, res: any) {
    const arrUrls: any = [];
    try {
      const sessionDetail = await this.SessionModel.findOne({
        sessionId,
      }).lean();
      // const res = await axios.get(
      //   this.configService.get<string>('API_AI_AVATAR') + '/v1/sessions',
      //   {
      //     params: {
      //       sessionId,
      //     },
      //   },
      // );
      // const results = res.data?.data?.session?.results;
      const results = sessionDetail?.results;
      Object.keys(results).forEach((key: string) => {
        arrUrls.push(...results[key]);
      });
    } catch (err: any) {
      handleError(err);
    }

    try {
      const archive = archiver('zip');
      res.setHeader('Content-Type', 'application/zip');
      res.attachment('images.zip');
      archive.pipe(res);
      const regex = /\/([^\/]+)$/;
      for (const imageUrl of arrUrls) {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const imageBuffer = response.data; // Dữ liệu tệp ảnh dưới dạng mảng byte
          const match = imageUrl.match(regex);
          const imageName = match[1];
          archive.append(imageBuffer, { name: imageName });
        } else {
          console.error(
            `Error download ${imageUrl}, status code: ${response.status}`,
          );
        }
      }

      archive.finalize();
    } catch (error) {
      handleError(error);
    }
  }

  async downloadAllAvatarWithStyle(
    query: QueryDownloadAllAvatarWithStyleDto,
    res: any,
  ) {
    let arrUrls: any = [];
    try {
      const sessionDetail = await this.SessionModel.findOne({
        sessionId: query.sessionId,
      }).lean();
      arrUrls = sessionDetail?.results[query.style];
    } catch (err: any) {
      handleError(err);
    }

    try {
      const archive = archiver('zip');
      res.setHeader('Content-Type', 'application/zip');
      res.attachment('images.zip');
      archive.pipe(res);
      const regex = /\/([^\/]+)$/;
      for (const imageUrl of arrUrls) {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const imageBuffer = response.data; // Dữ liệu tệp ảnh dưới dạng mảng byte
          const match = imageUrl.match(regex);
          const imageName = match[1];
          archive.append(imageBuffer, { name: imageName });
        } else {
          console.error(
            `Error download ${imageUrl}, status code: ${response.status}`,
          );
        }
      }
      archive.finalize();
    } catch (error) {
      handleError(error);
    }
  }

  async getListSession(userId: string) {
    const listSession = await this.SessionModel.find({ userId })
      .sort({
        createdAt: -1,
      })
      .lean();

    return {
      data: listSession.map((item: any) => formatedResponse(item)),
    };
    // console.log(listSession);
    // return this.SessionModel.find;
  }
}
