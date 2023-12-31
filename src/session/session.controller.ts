import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionService } from './session.service';
import {
  CreateSessionDto,
  QueryDownloadAvatarDto,
  QueryDownloadImageDto,
  SendMailDto,
  UpdateSessionDto,
} from './dto/index.dto';

@ApiTags('Session')
@ApiBearerAuth()
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() body: CreateSessionDto, @Req() req: any) {
    return this.sessionService.createSession(body, req.query.userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateSession(@Param('id') id: string, @Body() body: UpdateSessionDto) {
    return this.sessionService.updateSession(id, body);
  }

  @Get('remove-originFirstImage-and-add-originImages')
  @HttpCode(HttpStatus.OK)
  async removeOriginFirstImageAndAddOriginImages() {
    return this.sessionService.removeOriginFirstImageAndAddOriginImages();
  }

  @Get('download-image')
  @HttpCode(HttpStatus.OK)
  async downloadImage(@Query() query: QueryDownloadImageDto, @Res() res: any) {
    return this.sessionService.downloadImage(query, res);
  }

  @Get('download-avatar')
  @HttpCode(HttpStatus.OK)
  async downloadAvatar(
    @Query() query: QueryDownloadAvatarDto,
    @Res() res: any,
  ) {
    return this.sessionService.downloadAvatar(query, res);
  }

  @Get('download/:id')
  @HttpCode(HttpStatus.OK)
  async downloadResult(@Param('id') id: string, @Res() res: any) {
    return this.sessionService.downloadResult(id, res);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDetailSession(@Param('id') id: string, @Req() req: any) {
    return this.sessionService.getDetailSessionOfUser(id, req.query.userId);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getListSession(@Req() req: any) {
    return this.sessionService.getListSession(req.query.userId);
  }

  @Post('send-mail')
  @HttpCode(HttpStatus.OK)
  async sendMail(@Body() body: SendMailDto, @Req() req: any) {
    return this.sessionService.sendMail(body, req.query.user);
  }
  // @Get('profile')
  // getProfile(@User() user: CreateUserDto) {
  //   return this.userService.getDetailUser(user);
  // }
}
