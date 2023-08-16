import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { PROCESSOR_API_USER_QUEUE, QUEUE_BAN_USER } from '@lib/queue'
import { ApiUserService } from './api-user.service'
import { IBanUser } from './api-user.interface'
import { plainToInstance } from 'class-transformer'
import { STATUS } from '@lib/ban-user-history'
import { BanUserErrorMessage } from '@lib/grpc-client/user'

@Processor(PROCESSOR_API_USER_QUEUE)
export class ApiUserProcessor {
  private readonly logger = new Logger(ApiUserProcessor.name)

  constructor(private apiUserService: ApiUserService) {}

  @Process(QUEUE_BAN_USER)
  async handleBanUser(job: Job) {
    const data = plainToInstance(IBanUser, job.data)

    const banHistory = await this.apiUserService.getBanUserHistoryById(
      data.banUserHistoryId,
    )

    if (banHistory === undefined) {
      this.logger.error(
        `[${QUEUE_BAN_USER}] no ban history id: ${data.banUserHistoryId}`,
      )
      return
    }

    banHistory.banTime = `${Date.now()}`
    const externalResponse = {
      banUser: {},
      cancelWithdraw: {},
      cancelOrder: {},
      rejectKyc: {},
    }

    const result = await this.apiUserService.banUser(data.userId)
    externalResponse.banUser = result
    if (result.success) {
      banHistory.status = STATUS.SUCCESS
    } else if (result.message === BanUserErrorMessage.USER_NOT_FOUND) {
      banHistory.status = STATUS.NOT_FOUND
      banHistory.note = result.message
    } else if (result.message === BanUserErrorMessage.ALREADY_BANNED) {
      banHistory.status = STATUS.DUPLICATED_BANNED
      banHistory.note = result.message
    } else {
      banHistory.status = STATUS.FAIL
      banHistory.note = result.message
    }

    const requestLogInfo = {
      adminId: data.adminId,
      userAgent: data.userAgent,
      ip: data.ip,
    }
    const cancelWithdrawResult =
      await this.apiUserService.cancelWithdrawWhenBan(
        data.userId,
        requestLogInfo,
      )
    externalResponse.cancelWithdraw = cancelWithdrawResult.response

    const cancelOrderResult = await this.apiUserService.cancelOrderWhenBan(
      data.userId,
      data.adminId,
    )
    externalResponse.cancelOrder = cancelOrderResult

    const rejectKycResult = await this.apiUserService.rejectKycUser(
      data.userId,
      data.adminId,
    )
    if (!rejectKycResult.success) {
      banHistory.note = rejectKycResult.message
    }
    externalResponse.rejectKyc = rejectKycResult

    banHistory.externalResponse = JSON.stringify(externalResponse)
    await this.apiUserService.updateBanUserHistory(banHistory)
  }
}
