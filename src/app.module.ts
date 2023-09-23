import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configs';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Module } from './s3/s3.module';
import { StripeModule } from './stripe/stripe.module';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { WebhookModule } from './webhook/webhook.module';
import { MailModule } from './mail/mail.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { LoggerMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule.register({
      timeout: 10000,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    S3Module,
    StripeModule,
    WebhookModule,
    MailModule,
    SessionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'heath',
        'v1/stripe/prices',
        'v1/stripe/order',
        'v1/stripe/webhooks',
        'v1/webhook',
        'v1/session/download/:id',
        'v1/session/download-all-image-with-style',
        'v1/user/check-user-exist/:id',
        'v1/presign-link',
      )
      .forRoutes('*');

    consumer.apply(RawBodyMiddleware).forRoutes({
      path: 'v1/stripe/webhooks',
      method: RequestMethod.POST,
    });

    consumer
      .apply(JsonBodyMiddleware)
      .exclude('v1/stripe/webhooks')
      .forRoutes('*');
  }
}
