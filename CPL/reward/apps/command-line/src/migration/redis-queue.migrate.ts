import { BullQueueService } from '@lib/redis'
import { RedisConfig } from '@lib/redis/redis.config'
import { Inject, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as Bull from 'bull'
import { Job } from 'bull'
import { Command, CommandRunner } from 'nest-commander'

@Command({ name: 'redis-queue:migrate' })
export class RedisQueueMigrate extends CommandRunner {
  private readonly logger = new Logger(RedisQueueMigrate.name)

  constructor(
    @Inject(RedisConfig.KEY) private redisConfig: ConfigType<typeof RedisConfig>,
    private readonly bullQueueService: BullQueueService,
  ) {
    super()
  }

  async run(): Promise<void> {
    this.logger.log('Start Migrate Queue event ...')
    const bullOptions = {
      redis: {
        port: this.redisConfig.port,
        host: this.redisConfig.host,
        password: this.redisConfig.password,
      },
    }
    const eventHandler = new Bull('event_handler', bullOptions)
    const mainFunction = new Bull('worker', bullOptions)
    const sendReward = new Bull('send_reward', bullOptions)

    eventHandler.process('write-log', async ({ data }: Job<any>) => {
      this.logger.log(`eventHandler: wite-log, data: ${JSON.stringify(data)}`)
    })

    eventHandler.process('event-handler', async ({ data }: Job<any>) => {
      this.logger.log(`eventHandler: event-handler, data: ${JSON.stringify(data)}`)
      // dataExample = {
      //   msgId: 'topic_duy_auth_user_login_parition_0_offset_60',
      //   msgName: 'AUTH_USER_LOGIN',
      //   msgData: { user_id: '58737', lang: 'en', ip: '18.140.232.78', time: 1675306392095 },
      // }
      this.bullQueueService.addFilterMissionJob({
        userId: data.msgData.user_id,
        eventName: data.msgName,
        data: data.msgData,
        messageId: data.msgId,
        createTime: Math.ceil(data.msgData.time / 1000),
      })
    })

    mainFunction.process('mission-main-function', async ({ data }: Job<any>) => {
      this.logger.log(`mainFunction, data: ${JSON.stringify(data)}`)
      // dataExample = {
      //   groupKey: 'main_71_58737',
      //   msgId: 'topic_duy_auth_user_login_parition_0_offset_61',
      //   msgName: 'AUTH_USER_LOGIN',
      //   msgData: { user_id: '58737', lang: 'en', ip: '18.140.232.78', time: 1675306392095 },
      //   missionId: 242,
      //   campaignId: 71,
      // }
      this.bullQueueService.addCheckConditionJob({
        groupKey: `${data.msgData.user_id}_${data.campaignId}`,
        messageId: data.msgId,
        userId: data.msgData.user_id,
        eventName: data.msgName,
        data: data.msgData,
        missionId: data.missionId,
        campaignId: data.campaignId,
        createTime: Math.ceil(data.msgData.time / 1000),
      })
    })

    sendReward.process('send-reward', async ({ data }: Job<any>) => {
      this.logger.log(`Migrate queue main-function, data: ${JSON.stringify(data)}`)
      // dataExample = {
      //   id: 81661,
      //   userId: '58737',
      //   amount: '1',
      //   currency: 'AAVE',
      //   historyId: 81661,
      //   data: {
      //     groupKey: 'main_63_58737',
      //     msgId: 'topic_duy_auth_user_login_parition_0_offset_65',
      //     msgName: 'AUTH_USER_LOGIN',
      //     msgData: { user_id: '58737', lang: 'en', ip: '18.140.232.78', time: 1675306392095 },
      //     missionId: 232,
      //     campaignId: 63,
      //   },
      //   userType: 'user',
      //   referenceId: '157855673197755554',
      //   deliveryMethodWallet: 'direct_reward',
      //   groupKey: 'send-reward_58737',
      // }
    })
  }
}
