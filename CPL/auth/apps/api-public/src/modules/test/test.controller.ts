import { Controller, Get } from '@nestjs/common'
import { TestService } from './test.service'
import { DynamicLinkService } from '@lib/dynamic-link'
import { UserService } from '@lib/user'

@Controller('test')
export class TestController {
  constructor(
    private dynamicLinkService: DynamicLinkService,
    private readonly testService: TestService,
    private readonly userService: UserService,
  ) {}

  @Get('common')
  async common() {
    return this.userService.getUserById('1')
  }
}
