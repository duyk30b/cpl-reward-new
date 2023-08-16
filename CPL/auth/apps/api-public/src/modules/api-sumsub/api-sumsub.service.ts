import { RedisQueueService } from '@lib/redis-queue'
import { ISumsubWebhookPayload, SumsubService } from '@lib/sumsub'
import { UserInfoService, UserService } from '@lib/user'
import { UserKycService } from '@lib/user-kyc'
import { UserInfoStatus } from '@lib/user/enum/user.enum'
import { BusinessException, KycError } from '@lib/util'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ApiSumsubService {
  private readonly logger = new Logger(ApiSumsubService.name)
  constructor(
    private readonly sumsubService: SumsubService,
    private readonly userService: UserService,
    private readonly userKycService: UserKycService,
    private readonly userInfoService: UserInfoService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async createToken(userId: string) {
    const user = await this.userService.getUserById(userId)
    if (!user.email) {
      throw new BusinessException(KycError.USER_EMAIL_NOT_VERIFIED)
    }

    const { pending: userHavePendingKyc } =
      await this.userKycService.checkUserHavePendingKyc(userId)
    if (userHavePendingKyc) {
      throw new BusinessException(KycError.HAVE_PENDING_KYC)
    }

    if (user.userInfoStatus != UserInfoStatus.UPDATED) {
      throw new BusinessException(KycError.DOES_NOT_HAVE_INFO)
    }

    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    if (!userInfo) {
      throw new BusinessException(KycError.DOES_NOT_HAVE_INFO)
    }

    const applicant = await this.sumsubService.getApplicantData(userId)
    if (applicant && applicant.review?.reviewStatus != 'init') {
      throw new BusinessException(KycError.INVALID_STATUS)
    }

    return await this.sumsubService.createToken(userId)
  }

  async handleSumsubHook(data: ISumsubWebhookPayload) {
    switch (data.type) {
      case 'applicantPending':
        await this.handleApplicantPending(data)
        break
      case 'applicantReviewed':
        await this.handleApplicantReviewed(data)
        break
      default:
        break
    }
  }

  async handleApplicantPending(data: ISumsubWebhookPayload) {
    const { externalUserId, applicantType } = data
    const userId =
      this.sumsubService.getUserIdFromExternalUserId(externalUserId)
    this.logger.log(`Received pending hook for user id: ${userId}`)

    this.redisQueueService.addSumsubApplicantPendingJob({
      userId,
      applicantType,
    })
  }

  async handleApplicantReviewed(data: ISumsubWebhookPayload) {
    const externalUserId = data.externalUserId
    const userId =
      this.sumsubService.getUserIdFromExternalUserId(externalUserId)
    this.logger.log(`Received applicant reviewed hook for user id: ${userId}`)

    this.redisQueueService.addSumsubApplicantReviewedJob(userId)
  }
}
