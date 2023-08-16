import { UserService } from '@lib/user'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class DeleteUserService {
  private readonly logger = new Logger(DeleteUserService.name)

  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    utcOffset: 0,
  })
  async deleteUsers() {
    const pendingDeleteUsers = await this.userService.getPendingDeleteUsers()
    for (const user of pendingDeleteUsers) {
      await this.deleteUser(user.id)
    }
  }

  async deleteUser(userId: string) {
    await this.userService.deleteUser(userId)
    this.logger.debug(`Deleted user: ${userId}`)
  }
}
