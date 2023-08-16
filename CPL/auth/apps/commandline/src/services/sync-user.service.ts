import { ErrorSyncUserService } from '@lib/error-sync-user'
import { UserService } from '@lib/user'
import { Logger } from '@nestjs/common'
import { Command } from 'nest-commander'

@Command({ name: 'sync:user' })
export class SyncUserService {
  private readonly logger = new Logger(SyncUserService.name)
  constructor(
    private readonly errorSyncUserService: ErrorSyncUserService,
    private readonly userService: UserService,
  ) {}

  async run(passedParam: string[]): Promise<void> {
    const userIds = passedParam
    userIds.forEach(async (userId) => {
      const user = await this.userService.getUserById(userId)
      if (!user) {
        this.logger.log(`${userId} - User not found`)
        return
      }
      try {
        await this.userService.syncUserToBce(user)
        await this.errorSyncUserService.resolvedErrorSyncUser(userId)
        this.logger.log(`${userId} - User sync success`)
      } catch (e) {
        this.logger.error(`${userId} - User sync error`, e.stack)
      }
    })
  }
}
