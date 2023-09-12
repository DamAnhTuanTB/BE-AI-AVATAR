import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/index.dto';

@ApiTags('Session')
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() body: CreateSessionDto) {
    return this.sessionService.createSession(body);
  }

  @Get('download/:id')
  @HttpCode(HttpStatus.OK)
  async downloadResult(@Param('id') id: string, @Res() res: any) {
    this.sessionService.downloadResult(id, res);
  }

  // @Get('profile')
  // getProfile(@User() user: CreateUserDto) {
  //   return this.userService.getDetailUser(user);
  // }
}
