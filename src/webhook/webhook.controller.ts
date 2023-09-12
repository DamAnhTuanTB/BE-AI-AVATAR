import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhook')
@Controller({
  path: 'webhook',
  version: '1',
})
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async listenWebhook(@Body() body: any) {
    return this.webhookService.listenWebhook(body);
  }
}
