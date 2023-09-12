import { Injectable } from '@nestjs/common';
import { AvatarEvent } from './dto/index.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { SessionService } from 'src/session/session.service';

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

        return this.mailService.sendMail({
          to: sessionDetail.email,
          subject: 'AI Avatar - Your Result',
          template: './result',
          context: {
            name: sessionDetail.name,
            urlDownload: `${this.configService.get(
              'API_SERVER',
            )}/v1/session/download/${body.sessionId}`,
            urlUnsubscribe: '',
          },
        });
      case AvatarEvent.ERROR:
        break;
      default:
        break;
    }
  }
}
