import { Injectable, Logger } from '@nestjs/common'
import admin from 'firebase-admin'
import { IUserPushCommand } from '@libs/redis'
import { DeviceTokenService } from '@libs/device-token'
import { currentTimestamp } from '@libs/util'
import { PushLogService } from '@libs/noti-log'

@Injectable()
export class WorkerPushService {
  private readonly logger = new Logger(WorkerPushService.name)
  constructor(
    private readonly deviceTokenService: DeviceTokenService,
    private readonly personalPushLogService: PushLogService,
  ) {}

  async handleUserPushCommand(command: IUserPushCommand) {
    const { notification, data, userId, notificationId, pushScheduleId } =
      command
    const deviceTokens = await this.deviceTokenService.getActiveTokensOfUser(
      userId,
    )
    if (!deviceTokens.length) return
    const tokensToDeactive: string[] = []
    let response = null
    let success = false
    let error = null
    try {
      response = await admin.messaging().sendToDevice(
        deviceTokens,
        {
          data: {
            ...data,
            noti_id: notificationId || '',
            send_time: currentTimestamp().toString(),
          },
          notification: {
            sound: 'default',
            ...notification,
          },
        },
        {
          priority: 'high',
          mutableContent: true,
        },
      )
      for (let i = 0; i < response.results.length; i++) {
        const result = response.results[i]
        if (!result.error) continue
        if (
          result.error?.code == 'messaging/registration-token-not-registered'
        ) {
          tokensToDeactive.push(deviceTokens[i])
        }
      }
      this.logger.log(`Success to push to user id: ${userId}`)
      this.logger.log(`Token to deactive: ${tokensToDeactive}`)
      success = true
    } catch (e) {
      this.logger.error(`Fail to push to user id: ${userId}`)
      this.logger.error(e, e.stack)
      error = e.stack
    }

    await this.deviceTokenService.deactiveTokens(tokensToDeactive)

    try {
      await this.personalPushLogService.saveLog({
        userId,
        pushScheduleId,
        notificationId,
        data: command,
        success,
        response,
        error,
      })
    } catch (e) {
      this.logger.error(`Fail to save push log of user id: ${userId}`)
      this.logger.log(e, e.stack)
    }
  }
}
