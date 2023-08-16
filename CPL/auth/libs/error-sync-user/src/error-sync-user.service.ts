import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ErrorSyncUser } from './error-sync-user.entity'
import { SyncStatus } from './error-sync-user.enum'

@Injectable()
export class ErrorSyncUserService {
  constructor(
    @InjectRepository(ErrorSyncUser)
    private readonly errorSyncUserRepository: Repository<ErrorSyncUser>,
  ) {}

  async getByUserId(userId: string) {
    return await this.errorSyncUserRepository.findOne({ userId })
  }

  async logErrorSyncUser(userId: string) {
    const errorSyncUser = new ErrorSyncUser()
    errorSyncUser.userId = userId
    errorSyncUser.status = SyncStatus.UNRESOLVED
    return await this.errorSyncUserRepository.save(errorSyncUser)
  }

  async resolvingErrorSyncUser(userId: string) {
    await this.errorSyncUserRepository.update(
      { userId },
      { status: SyncStatus.RESOLVING },
    )
  }

  async resolvedErrorSyncUser(userId: string) {
    await this.errorSyncUserRepository.update(
      { userId },
      { status: SyncStatus.RESOLVED, resolvedAt: new Date().getTime() },
    )
  }

  async getUnresolvedErrorSyncUsers() {
    return await this.errorSyncUserRepository.find({
      where: { status: SyncStatus.UNRESOLVED },
    })
  }
}
