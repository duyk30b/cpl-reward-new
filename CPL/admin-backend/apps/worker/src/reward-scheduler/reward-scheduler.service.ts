import { AdminService } from '@lib/admin'
import {
  MailTemplate,
  NotificationService,
} from '@lib/grpc-client/notification'
import { RewardService } from '@lib/grpc-client/reward'
import { MissionUserLogStatus } from '@lib/grpc-client/reward/reward.enum'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import GlobalConfig from 'config/global'
import * as moment from 'moment'
import { Permission } from '../../../../apps/api/src/permissions/permission.data'

@Injectable()
export class RewardSchedulerService {
  constructor(
    @Inject(GlobalConfig.KEY)
    private globalConfig: ConfigType<typeof GlobalConfig>,
    private readonly rewardService: RewardService,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService,
  ) {}
  @Cron(CronExpression.EVERY_HOUR, { utcOffset: 0 })
  async sendEmailMissingReward() {
    const toTime = Date.now()
    const fromTime =
      toTime - this.globalConfig.time_send_email_missing_reward * 1000

    const countMissReward = (
      await this.rewardService.countRewardLog({
        status: MissionUserLogStatus.NEED_TO_RESOLVE,
        fromTime: Math.floor(fromTime / 1000),
        toTime: Math.floor(toTime / 1000),
      })
    ).count

    if (countMissReward === 0) return

    const adminList = await this.adminService.getAdminsByPermissionId(
      Permission.REWARD_LOG_GET_LIST,
    )
    const emails = adminList.map((item) => item.email)
    const fromTimeFormat = moment(new Date(fromTime)).format(
      'YYYY-MM-DD HH:mm:ss (UTC)',
    )
    const toTimeFormat = moment(new Date(toTime)).format(
      'YYYY-MM-DD HH:mm:ss (UTC)',
    )

    this.notificationService.sendMail({
      emails,
      data: JSON.stringify({
        fromTime: fromTimeFormat,
        toTime: toTimeFormat,
        countMissReward,
        urlMissingReward: `${this.globalConfig.admin_v3_frontend_url}/#/missing-rewards/list`,
      }),
      mailCommand: {
        lang: 'en',
        template: MailTemplate.MISSING_REWARD,
      },
    })
  }
}
