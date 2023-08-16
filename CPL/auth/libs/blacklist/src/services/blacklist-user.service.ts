import { UserService } from '@lib/user'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Raw, Repository } from 'typeorm'
import { BlacklistUser } from '../entities/blacklist-user.entity'

@Injectable()
export class BlacklistUserService {
  constructor(
    @InjectRepository(BlacklistUser)
    private readonly blacklistUserRepository: Repository<BlacklistUser>,
    private readonly userService: UserService,
  ) {}

  async checkUserBlacklisted(userId: string): Promise<boolean> {
    const blacklist = await this.blacklistUserRepository.findOne({
      userId: userId,
    })
    const until = blacklist ? Number(blacklist.until) : 0
    return !!blacklist && (!until || until >= new Date().getTime())
  }

  async banUser(userId: string, effectiveHour?: number, note?: string) {
    await this.userService.toggleBanUsers([userId], true)
    const until = effectiveHour
      ? new Date().getTime() + effectiveHour * 60 * 60 * 1000
      : 0

    const existing = await this.blacklistUserRepository.findOne({
      userId: userId,
    })

    if (existing) {
      existing.note = note
      existing.until = until
      await this.blacklistUserRepository.save(existing)
      return until
    }

    const blacklistUser = new BlacklistUser()
    blacklistUser.userId = userId
    blacklistUser.note = note
    blacklistUser.until = until
    await this.blacklistUserRepository.save(blacklistUser)
    return until
  }

  async unbanUser(userId: string) {
    await this.userService.toggleBanUsers([userId], false)
    await this.blacklistUserRepository.delete({ userId })
  }

  async unbanUsersByExpiredTime() {
    const currentTime = new Date().getTime()
    const blackListUnban = await this.blacklistUserRepository.find({
      select: ['userId'],
      where: {
        until: Raw((alias) => `${alias} < :currentTime and ${alias} != 0`, {
          currentTime: currentTime,
        }),
      },
    })
    if (!blackListUnban.length) return

    const userIdsUnban = blackListUnban.map((item) => item.userId)
    await this.userService.toggleBanUsers(userIdsUnban, false)
    await this.blacklistUserRepository.delete({ userId: In(userIdsUnban) })
  }
}
