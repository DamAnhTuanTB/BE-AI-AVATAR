import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMail } from './dto/index.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(payload: SendMail) {
    const { to, subject, template, context } = payload;
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
