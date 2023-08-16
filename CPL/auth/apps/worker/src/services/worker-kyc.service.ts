import { Injectable, Logger } from '@nestjs/common'
import { KycProviderService } from '@lib/kyc-provider'
import { AuthSettingService } from '@lib/auth-setting'
import { UserInfoService, UserService } from '@lib/user'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { UserKycVerifyStatus } from '@lib/user/enum/user.enum'
import { SocketEvent, UserKycEvent } from '@lib/util'
import { AutoKycFinishedEvent } from '../cynopsis.event'
import { KycProviderDecision } from '@lib/kyc-provider/kyc-provider.type'
import { CreateUserKycAdminDecisionDto } from '@lib/user-kyc-admin/dto/create-user-kyc-admin-decision.dto'
import { UserKycAdminService } from '@lib/user-kyc-admin'
import { BlacklistUserService } from '@lib/blacklist'
import { UserKycService, UserKycHistoryService } from '@lib/user-kyc'
import {
  IAutoKycFinishedEvent,
  IKycDocumentApprovedEvent,
  IUserKycRegisteredEvent,
  IUserKycStatusUpdatedEvent,
  RedisQueueService,
  UserKycStatusUpdatedEvent,
} from '@lib/redis-queue'
import { classToClass, plainToClass } from 'class-transformer'
import { KafkaService } from '@lib/kafka'
import { SumsubService } from '@lib/sumsub'
import { SumsubResponseService } from '@lib/user-kyc-sumsub/services/sumsub-response.service'
import { WebsocketService } from '@lib/websocket'

@Injectable()
export class WorkerKycService {
  private readonly logger = new Logger(WorkerKycService.name)

  constructor(
    private readonly kycProviderService: KycProviderService,
    private readonly userKycService: UserKycService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly userService: UserService,
    private readonly authSettingService: AuthSettingService,
    private readonly userKycAdminService: UserKycAdminService,
    private readonly blacklistUserService: BlacklistUserService,
    private readonly redisQueueService: RedisQueueService,
    private readonly kafkaService: KafkaService,
    private readonly sumsubResponseService: SumsubResponseService,
    private readonly sumsubService: SumsubService,
    private readonly websocketService: WebsocketService,
    private readonly userInfoService: UserInfoService,
  ) {}

  async handleKycRegistered(data: IUserKycRegisteredEvent) {
    const { userId } = data
    this.logger.log('Start auto kyc for user ' + userId)
    const userKyc = await this.userKycService.getKycByUserId(userId)
    if (!userKyc) {
      this.logger.error('Cannot find user_kyc by user id ' + userId)
      return
    }

    const clone = classToClass(userKyc, { ignoreDecorators: true })
    delete clone.files
    this.kafkaService.sendWithTopicFromConfig(UserKycEvent.REGISTERED, clone)

    await this.kycRegisteredBusinessLogic(userKyc)

    this.websocketService.publish(userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        kyc_type: userKyc.type,
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDocumentApproved(data: IKycDocumentApprovedEvent) {
    // if (!data || !data.userKycHistoryId) {
    //   this.logger.error(
    //     'Function handleDocumentApproved cannot get userKycHistoryId',
    //   )
    //   return
    // }
    // const userKycHistoryId = data.userKycHistoryId
    // const userKyc = await this.userKycService.getKycByHistoryId(
    //   userKycHistoryId,
    // )
    // if (!userKyc) {
    //   this.logger.error('Cannot find history of by id ' + userKycHistoryId)
    //   return
    // }
    // await this.paperAcceptedBusinessLogic(userKyc)
  }

  async handleKycStatusUpdated(data: IUserKycStatusUpdatedEvent) {
    const { status, userId } = data
    const event = plainToClass(UserKycStatusUpdatedEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(
      UserKycEvent.STATUS_UPDATED,
      event,
    )
    if (status == UserKycVerifyStatus.REJECTED) {
      const userKyc = await this.userKycService.getKycByUserId(userId)
      if (userKyc) {
        const imageProviders = userKyc.imageProviders.map((provider) =>
          this.kycProviderService.getImageProvider(provider),
        )

        const riskScanProviders = userKyc.riskScanProviders.map((provider) =>
          this.kycProviderService.getRiskProvider(provider),
        )

        await Promise.all(
          [...imageProviders, ...riskScanProviders].map((provider) =>
            provider.logicAfterReject(userKyc),
          ),
        )
      }
    }
    this.websocketService.publish(userId, {
      event: SocketEvent.USER_UPDATED,
      data: {
        kyc_verify_status: status,
      },
    })
  }

  async kycRegisteredBusinessLogic(userKyc: UserKyc) {
    try {
      const imageProviders = userKyc.imageProviders.map((provider) =>
        this.kycProviderService.getImageProvider(provider),
      )

      await Promise.all(
        imageProviders.map((imageProvider) => imageProvider.process(userKyc)),
      )

      const riskScanProviders = userKyc.riskScanProviders.map((provider) =>
        this.kycProviderService.getRiskProvider(provider),
      )

      await Promise.all(
        riskScanProviders.map((riskScanProvider) =>
          riskScanProvider.process(userKyc),
        ),
      )
    } catch (e) {
      this.logger.error('Error process KYC for user id: ' + userKyc.userId)
      this.logger.error(e, e.stack)
    }

    await this.updateKycProcessResult(userKyc)
  }

  async handleAutoKycFinished(data: IAutoKycFinishedEvent) {
    const event = plainToClass(AutoKycFinishedEvent, data, {
      ignoreDecorators: true,
    })
    this.kafkaService.sendWithTopicFromConfig(
      UserKycEvent.AUTO_KYC_FINISHED,
      event,
    )
  }

  // private async paperAcceptedBusinessLogic(userKyc: UserKyc) {
  //   const riskScanProviders = userKyc.riskScanProviders.map((provider) =>
  //     this.kycProviderService.getRiskProvider(provider),
  //   )

  //   await Promise.all(
  //     riskScanProviders.map((riskScanProvider) =>
  //       riskScanProvider.process(userKyc),
  //     ),
  //   )
  // }

  private async updateKycProcessResult(userKyc: UserKyc) {
    const autoKycFinishedEvent = {} as IAutoKycFinishedEvent
    autoKycFinishedEvent.userId = userKyc.userId
    autoKycFinishedEvent.pass = false

    const decision = await this.getFinalAutoKycDecision(userKyc)

    switch (decision) {
      case KycProviderDecision.ADMIN_ACCEPT:
        await this.logicForAdminAcceptKycDecision(userKyc)
        autoKycFinishedEvent.pass = true
        break

      case KycProviderDecision.AUTO_KYC_PASS:
        await this.logicForWaitForAdminDecision(userKyc)
        break

      case KycProviderDecision.AUTO_KYC_REJECT:
        await this.logicForWaitForAdminDecision(userKyc)
        break

      case KycProviderDecision.ADMIN_REJECT:
        await this.logicForAdminRejectKycDecision(userKyc)
        break

      case KycProviderDecision.BAN:
        await this.logicForBanDecision(userKyc)
        break

      default:
        break
    }
    this.logger.log(
      `Give decision ${KycProviderDecision[decision]} for user id: ${userKyc.userId}`,
    )
    this.redisQueueService.addAutoKycFinishedJob(autoKycFinishedEvent)
    this.logger.log(`Auto KYC processed for user id: ${userKyc.userId}`)
  }

  private async logicForAdminAcceptKycDecision(userKyc: UserKyc) {
    const { userKycHistoryId, userId } = userKyc

    const adminAcceptDecisionDto = new CreateUserKycAdminDecisionDto()
    adminAcceptDecisionDto.compareName = true
    adminAcceptDecisionDto.compareBirthday = true
    adminAcceptDecisionDto.compareDocumentType = true
    adminAcceptDecisionDto.compareLivenessSelfie = true
    adminAcceptDecisionDto.userId = userId
    adminAcceptDecisionDto.userKycHistoryId = userKycHistoryId
    adminAcceptDecisionDto.status = KycStatus.ACCEPT
    adminAcceptDecisionDto.isAuto = true
    await this.userKycAdminService.saveAdminDecision(adminAcceptDecisionDto)

    await this.userKycService.updateUserKyc(userKyc.id, {
      status: KycStatus.ACCEPT,
    })

    await this.userService.updateKycVerifyStatus(
      userId,
      UserKycVerifyStatus.VERIFIED,
    )
    await this.userService.updateLv(userId, 4)
  }

  private async logicForWaitForAdminDecision(userKyc: UserKyc) {
    await this.userKycService.updateUserKyc(userKyc.id, {
      status: KycStatus.AUTO_KYC_PROCESSED,
    })
  }

  private async logicForAdminRejectKycDecision(userKyc: UserKyc) {
    await this.rejectKyc(userKyc)
  }

  private async logicForBanDecision(userKyc: UserKyc) {
    const { userId } = userKyc
    await this.rejectKyc(userKyc)
    await this.blacklistUserService.banUser(userId)
    await this.userService.logoutAllDevices(userId)

    this.redisQueueService.addUserBanJob({
      userId,
      auto: true,
    })
  }

  private async rejectKyc(userKyc: UserKyc) {
    const { userKycHistoryId, userId } = userKyc
    const rejectionReasons =
      await this.authSettingService.getAutoKycRejectionReason()

    const adminRejectDecisionDto = new CreateUserKycAdminDecisionDto()
    adminRejectDecisionDto.compareName = false
    adminRejectDecisionDto.compareBirthday = false
    adminRejectDecisionDto.compareDocumentType = false
    adminRejectDecisionDto.compareLivenessSelfie = false
    adminRejectDecisionDto.userId = userId
    adminRejectDecisionDto.userKycHistoryId = userKycHistoryId
    adminRejectDecisionDto.status = KycStatus.REJECT
    adminRejectDecisionDto.rejectionReasons = rejectionReasons
    adminRejectDecisionDto.isAuto = true
    await this.userKycAdminService.saveAdminDecision(adminRejectDecisionDto)

    await this.userKycService.updateUserKyc(userKyc.id, {
      status: KycStatus.REJECT,
      rejectionReasons,
    })

    await this.userService.updateKycVerifyStatus(
      userKyc.userId,
      UserKycVerifyStatus.REJECTED,
    )
  }

  private async getFinalAutoKycDecision(userKyc: UserKyc) {
    const imageProviders = userKyc.imageProviders.map((provider) =>
      this.kycProviderService.getImageProvider(provider),
    )
    const results = await Promise.all(
      imageProviders.map(async (imageProvider) => {
        const decision = await imageProvider.getFinalDecision(userKyc)
        return {
          decision,
          isBestDecision: decision == imageProvider.getBestDecision(),
        }
      }),
    )
    const decisions = results.map((result) => result.decision)
    const isAllBestDecision = results.every((result) => result.isBestDecision)
    if (isAllBestDecision) {
      return Math.min(...decisions)
    }
    return Math.max(...decisions)
  }
}
