import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './model/session.model';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: 'Session',
        schema: SessionSchema,
      },
    ]),
    UserModule,
    MailModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
