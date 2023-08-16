import { Injectable } from '@nestjs/common'
import { UserService } from '@lib/user'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class AuthLogoutService {
  constructor(
    private readonly usersService: UserService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async logout(userId: string, deviceId: string) {
    const res = await this.usersService.logout(userId, deviceId)

    this.redisQueueService.addUserProactivelyLogoutJob({ userId, deviceId })
    return res
  }
}
