import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('check-user-exist/:id')
  @HttpCode(HttpStatus.OK)
  async checkUserExist(@Param('id') id: string) {
    return this.userService.checkUserExist(id);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query() query) {
    return this.userService.getProfile(query.user);
  }
}
