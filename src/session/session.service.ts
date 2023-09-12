import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleError } from 'src/utils';
import { SessionDocument } from './model/session.model';
import { CreateSessionDto } from './dto/index.dto';
import * as archiver from 'archiver';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session')
    private readonly SessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
  ) {}
  async createSession(body: CreateSessionDto) {
    return this.SessionModel.create(body);
  }

  async getDetailSession(sessionId: string) {
    return await this.SessionModel.findOne({ sessionId }).lean();
  }

  async downloadResult(sessionId: string, res: any) {
    const arrUrls: any = [];
    try {
      const res = await axios.get(
        this.configService.get<string>('API_AI_AVATAR') + '/v1/sessions',
        {
          params: {
            sessionId,
          },
        },
      );
      const results = res.data?.data?.session?.results;
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
}
