import { ErrorSyncUserService } from '@lib/error-sync-user'
import { UserService } from '@lib/user'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'

@Injectable()
export class ResolveErrorSyncUserService {
  private readonly logger = new Logger(ResolveErrorSyncUserService.name)

  constructor(
    private readonly userService: UserService,
    private readonly errorSyncUserService: ErrorSyncUserService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {
    const intervalResolveErrorSync = setInterval(
      () => this.resolveErrorSyncUsers(),
      this.configService.get('resolve_error_sync_user_interval'),
    )
    this.schedulerRegistry.addInterval(
      'intervalResolveErrorSync',
      intervalResolveErrorSync,
    )
  }

  async resolveErrorSyncUsers() {
    const errorSyncUsers =
      await this.errorSyncUserService.getUnresolvedErrorSyncUsers()
    for (let i = 0; i < errorSyncUsers.length; i++) {
      await this.resolveErrorSyncUser(errorSyncUsers[i].userId)
    }
  }

  async resolveErrorSyncUser(userId: string) {
    await this.errorSyncUserService.resolvingErrorSyncUser(userId)
    this.logger.debug(`Resolving user: ${userId}`)
    try {
      const user = await this.userService.getUserById(userId)
      await this.userService.syncUserToBce(user)
      await this.errorSyncUserService.resolvedErrorSyncUser(userId)
      this.logger.debug(`Resolved user: ${userId}`)
    } catch (e) {
      this.logger.debug(`Fail to resolve user: ${userId}`)
      this.logger.error(e, e.stack)
      await this.errorSyncUserService.logErrorSyncUser(userId)
    }
  }
}
