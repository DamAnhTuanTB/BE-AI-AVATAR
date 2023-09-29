import { Injectable } from '@nestjs/common';
import { AvatarEvent } from './dto/index.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { SessionService } from 'src/session/session.service';
import { TypeSessionStatus } from 'src/session/model/session.model';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
  ) {}
  async listenWebhook(body: any) {
    switch (body.event) {
      case AvatarEvent.AVATAR_RESULT:
        const sessionDetail = await this.sessionService.getDetailSession(
          body.sessionId,
        );

        this.mailService.sendMail({
          to: sessionDetail.email,
          subject: '✨ Your Avatar Creation is Complete! ✨',
          template: './result',
          context: {
            name: sessionDetail.name,
            urlDownload: `${this.configService.get('CLIENT_URI')}/my-avatar`,
          },
        });

        const res = await axios.get(
          this.configService.get<string>('API_AI_AVATAR') + '/v1/sessions',
          {
            params: {
              sessionId: body.sessionId,
            },
          },
        );

        const results = res.data?.data?.session?.results;

        return this.sessionService.updateSession(body.sessionId, {
          status: TypeSessionStatus.COMPLETE,
          results,
          updatedAt: new Date(),
        });

      case AvatarEvent.ERROR:
        break;
      default:
        break;
    }
  }
}
