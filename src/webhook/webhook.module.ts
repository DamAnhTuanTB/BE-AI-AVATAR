import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MailModule } from 'src/mail/mail.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [ConfigModule, MailModule, SessionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
