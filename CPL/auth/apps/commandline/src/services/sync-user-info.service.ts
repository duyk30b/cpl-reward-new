import { KafkaService } from '@lib/kafka'
import { UserChangeInfoEvent } from '@lib/redis-queue'
import { UserInfoService } from '@lib/user'
import { UserEvent } from '@lib/util'
import { Logger } from '@nestjs/common'
import { Command } from 'nest-commander'

@Command({ name: 'sync:user-info' })
export class SyncUserInfoService {
  private readonly logger = new Logger(SyncUserInfoService.name)
  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly kafkaService: KafkaService,
  ) {}

  async run(passedParam: string[]): Promise<void> {
    for (const userId of passedParam) {
      const userInfo = await this.userInfoService.getInfoByUserId(userId)
      if (!userInfo) {
        this.logger.log(`${userId} - User info not found`)
        continue
      }
      try {
        const changeInfoEvent = new UserChangeInfoEvent()
        changeInfoEvent.userId = userId
        await this.kafkaService.sendWithTopicFromConfig(
          UserEvent.CHANGE_INFO,
          changeInfoEvent,
        )
        this.logger.log(`${userId} - User info sync success`)
      } catch (e) {
        this.logger.error(`${userId} - User info sync error`, e.stack)
      }
    }
  }
}
