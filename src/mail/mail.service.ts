import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMail } from './dto/index.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(payload: SendMail) {
    console.log('USERNAME', process.env.MAIL_USER);
    console.log('MAIL_PASSWORD', process.env.MAIL_PASSWORD);
    const { to, subject, template, context } = payload;
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      console.log('Error mail', error?.response);
    }
  }
}
