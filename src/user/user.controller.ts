import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Stripe')
@Controller({
  path: 'stripe',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}
}
