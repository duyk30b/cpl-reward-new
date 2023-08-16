import { BlacklistUserService } from '@lib/blacklist'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class UpdateUserService {
  constructor(private readonly blacklistUserService: BlacklistUserService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async unbanUsersByExpiredTime() {
    this.blacklistUserService.unbanUsersByExpiredTime()
  }
}
