import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';

@Controller('health')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  getHello() {
    return this.mailService.sendMail({
      to: 'hello@avatarist.ai',
      subject: 'Avatarist - Your Result',
      template: './result',
      context: {
        name: 'you',
        urlDownload:
          'https://0497-222-252-18-109.ngrok-free.app/nextapi/v1/session/download/8dlU1IWzXjLn22b',
        urlUnsubscribe: '',
      },
    });
  }
}
