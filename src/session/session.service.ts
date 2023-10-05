import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatedResponse, handleError } from 'src/utils';
import { SessionDocument } from './model/session.model';
import * as fs from 'fs';
import {
  CreateSessionDto,
  QueryDownloadAvatarDto,
  SendMailDto,
  TypeDownload,
  QueryDownloadImageDto,
} from './dto/index.dto';
import * as archiver from 'archiver';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UpdateInfoUserDto } from 'src/user/dto/index.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session')
    private readonly SessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  async createSession(body: CreateSessionDto, userId: string) {
    const userDetail = await this.userService.getDetailUser(userId);
    const listGenerate = userDetail.listGenerate;
    listGenerate.forEach((item: any, index: number) => {
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
    });
  }

  async getDetailSessionOfUser(sessionId: string, userId: string) {
    try {
      const sessionDetail = await this.SessionModel.findOne({
        sessionId,
        userId,
      }).lean();
      return formatedResponse(sessionDetail);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getDetailSession(sessionId: string) {
    const sessionDetail = await this.SessionModel.findOne({
      sessionId,
    }).lean();
    return formatedResponse(sessionDetail);
  }

  async updateSession(sessionId: string, payload: any) {
    await this.SessionModel.updateOne({ sessionId }, payload);
  }

  async downloadAvatar(query: QueryDownloadAvatarDto, res: any) {
    const arrUrls: any = [];
    try {
      const sessionDetail = await this.SessionModel.findOne({
        sessionId: query.sessionId,
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
      switch (query.type) {
        case TypeDownload.ALL_RESULT: {
          const results = sessionDetail?.results;
          Object.keys(results).forEach((key: string) => {
            arrUrls.push(...results[key]);
          });
          arrUrls.push(...sessionDetail?.originImages);
          break;
        }
        case TypeDownload.ALL_AVATAR: {
          const results = sessionDetail?.results;
          Object.keys(results).forEach((key: string) => {
            arrUrls.push(...results[key]);
          });
          break;
        }
        case TypeDownload.ALL_AVATAR_WITH_STYLE: {
          arrUrls.push(...sessionDetail?.results[query.style]);
          break;
        }
        case TypeDownload.ALL_ORIGIN_PHOTO: {
          arrUrls.push(...sessionDetail?.originImages);
          break;
        }
        default:
          break;
      }
      // const results = sessionDetail?.results;
      // Object.keys(results).forEach((key: string) => {
      //   arrUrls.push(...results[key]);
      // });
      // arrUrls.push(...sessionDetail?.originImages);
    } catch (err: any) {
      handleError(err);
    }

    try {
      const archive = archiver('zip');
      res.setHeader('Content-Type', 'application/zip');
      res.attachment('AI-Avatarist-Album.zip');
      archive.pipe(res);
      const regex = /\/([^\/]+)$/;
      for (const imageUrl of arrUrls) {
        console.log(imageUrl);
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const imageBuffer = response.data; // Dữ liệu tệp ảnh dưới dạng mảng byte
          const match = imageUrl.match(regex);
          const imageName = match[1];
          archive.append(imageBuffer, { name: imageName });
          console.log(response.data);
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
      res.attachment('AI-Avatarist-Album.zip');
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

  async downloadImage(query: QueryDownloadImageDto, res: any) {
    try {
      // Tải xuống ảnh từ URL
      const imageResponse = await axios.get(query.url, {
        responseType: 'stream',
      });

      // Thiết lập các header cho phản hồi
      res.setHeader('Content-Type', imageResponse.headers['content-type']);
      res.setHeader('Content-Length', imageResponse.headers['content-length']);

      // Gửi dữ liệu ảnh về client
      imageResponse.data.pipe(res);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
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
  }

  async sendMail(body: SendMailDto, user: any) {
    return this.mailService.sendMail({ ...body, to: user.email });
  }

  async removeOriginFirstImageAndAddOriginImages() {
    const sessions = await this.SessionModel.find().lean();
    for (const item of sessions) {
      const originImages = item?.originImages || [];
      const originFirstImage = item?.originFirstImage;
      if (originFirstImage) {
        originImages.push(originFirstImage);
      }
      await this.SessionModel.updateOne(
        { _id: item._id },
        {
          originImages,
        },
      );
    }
    await this.SessionModel.updateMany(
      {},
      {
        $unset: { originFirstImage: '' },
      },
    );
  }
}
