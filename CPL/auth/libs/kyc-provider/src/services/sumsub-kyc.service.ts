/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SumsubReviewAnswer,
  SumsubReviewRejectType,
  SumsubService,
} from '@lib/sumsub'
import { UserKycAdminService } from '@lib/user-kyc-admin'
import { SumsubInfoHistoryService } from '@lib/user-kyc-sumsub/services/sumsub-info-history.service'
import { SumsubResponseService } from '@lib/user-kyc-sumsub/services/sumsub-response.service'
import { ICreateSumsubInfoHistoryDto } from '@lib/user-kyc-sumsub/user-kyc-sumsub.type'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  DuplicateStatus,
  IdentityDocumentVerificationStatus,
  KycImageProvider,
  LivenessStatus,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  IKycImageProcessResult,
  IKycImageProviderService,
  KycProviderDecision,
  KycProviderResultStatus,
} from '../kyc-provider.type'

@Injectable()
export class SumsubKycService implements IKycImageProviderService {
  private readonly logger = new Logger(SumsubKycService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly sumsubService: SumsubService,
    private readonly sumsubResponseService: SumsubResponseService,
    private readonly sumsubInfoHistoryService: SumsubInfoHistoryService,
    private readonly userKycAdminService: UserKycAdminService,
  ) {}

  async process(userKyc: UserKyc) {
    const { userId, userKycHistoryId } = userKyc
    const createSumsubInfoHistoryDto: ICreateSumsubInfoHistoryDto = {
      userId,
      userKycHistoryId,
    }
    const applicant = await this.sumsubService.getApplicantData(userId)
    if (applicant) {
      const sumsubResponse =
        await this.sumsubResponseService.findByUserKycHistoryId(
          userKycHistoryId,
        )
      const compareResponse = sumsubResponse?.compareResponse
      const livenessResponse = sumsubResponse?.livenessResponse
      const identityDocumentVerificationResponse =
        sumsubResponse?.identityDocumentVerificationResponse
      const similarApplicantsResponse =
        sumsubResponse?.similarApplicantsResponse

      createSumsubInfoHistoryDto.applicantId = applicant.id
      createSumsubInfoHistoryDto.reviewAnswer =
        applicant.review?.reviewResult?.reviewAnswer
      createSumsubInfoHistoryDto.reviewRejectType =
        applicant.review?.reviewResult?.reviewRejectType

      if (compareResponse?.answer == SumsubReviewAnswer.GREEN) {
        createSumsubInfoHistoryDto.compareStatus = CompareStatus.MATCHED
      } else if (compareResponse?.answer == SumsubReviewAnswer.RED) {
        createSumsubInfoHistoryDto.compareStatus = CompareStatus.NOT_MATCHED
      } else {
        createSumsubInfoHistoryDto.compareStatus = CompareStatus.UNCERTAIN
      }

      if (livenessResponse?.answer == SumsubReviewAnswer.GREEN) {
        createSumsubInfoHistoryDto.livenessStatus = LivenessStatus.PASS
      } else if (livenessResponse?.answer == SumsubReviewAnswer.RED) {
        createSumsubInfoHistoryDto.livenessStatus = LivenessStatus.FAIL
      } else {
        createSumsubInfoHistoryDto.livenessStatus = LivenessStatus.UNKNOWN
      }

      if (
        identityDocumentVerificationResponse?.result?.reviewResult
          ?.reviewAnswer == SumsubReviewAnswer.GREEN
      ) {
        createSumsubInfoHistoryDto.identityDocumentVerificationStatus =
          IdentityDocumentVerificationStatus.PASS
      } else if (
        identityDocumentVerificationResponse?.result?.reviewResult
          ?.reviewAnswer == SumsubReviewAnswer.RED
      ) {
        createSumsubInfoHistoryDto.identityDocumentVerificationStatus =
          IdentityDocumentVerificationStatus.FAIL
      } else {
        createSumsubInfoHistoryDto.identityDocumentVerificationStatus =
          IdentityDocumentVerificationStatus.UNKNOWN
      }

      if (similarApplicantsResponse?.similarApplicants) {
        const similarApplicants = similarApplicantsResponse?.similarApplicants
        if (!similarApplicants.length) {
          createSumsubInfoHistoryDto.duplicateStatus =
            DuplicateStatus.NOT_DUPLICATE
        } else if (similarApplicants.find((e) => e.exactMatch)) {
          createSumsubInfoHistoryDto.duplicateStatus =
            DuplicateStatus.HAVE_DUPLICATE
        } else {
          createSumsubInfoHistoryDto.duplicateStatus = DuplicateStatus.WARNING
        }
      } else {
        createSumsubInfoHistoryDto.duplicateStatus = DuplicateStatus.UNKNOWN
      }
    }

    await this.sumsubInfoHistoryService.createSumsubInfoHistory(
      createSumsubInfoHistoryDto,
    )
  }

  async deleteFaceIndex(userKycHistory: UserKycHistory) {
    const applicant = await this.sumsubService.getApplicantData(
      userKycHistory.userId,
    )
    if (!applicant) return
    await this.sumsubService.deleteApplicant(applicant.id)
  }

  async getFinalDecision(userKyc: UserKyc): Promise<KycProviderDecision> {
    const { userKycHistoryId, userId } = userKyc
    const sumsubInfoHistory =
      await this.sumsubInfoHistoryService.findByUserKycHistoryId(
        userKycHistoryId,
      )
    if (!sumsubInfoHistory) return KycProviderDecision.AUTO_KYC_REJECT

    if (sumsubInfoHistory.reviewAnswer == SumsubReviewAnswer.GREEN)
      return KycProviderDecision.ADMIN_ACCEPT
    if (sumsubInfoHistory.reviewAnswer == SumsubReviewAnswer.RED) {
      if (sumsubInfoHistory.reviewRejectType == SumsubReviewRejectType.RETRY) {
        const numberAutoReject =
          await this.userKycAdminService.countDecisionAutoReject(userId)
        if (
          numberAutoReject < this.configService.get('kyc.maxSumsubAutoReject')
        ) {
          return KycProviderDecision.ADMIN_REJECT
        }
        return KycProviderDecision.AUTO_KYC_REJECT
      } else if (
        sumsubInfoHistory.reviewRejectType == SumsubReviewRejectType.FINAL
      ) {
        return KycProviderDecision.AUTO_KYC_REJECT
      }
    }
    return KycProviderDecision.AUTO_KYC_REJECT
  }

  getBestDecision(): KycProviderDecision {
    return KycProviderDecision.ADMIN_ACCEPT
  }

  async logicAfterReject(userKyc: UserKyc): Promise<void> {
    const { userId } = userKyc
    const applicant = await this.sumsubService.getApplicantData(userId)
    if (!applicant) return
    await this.sumsubService.resetApplicant(applicant.id)
  }

  async getProcessResult(
    userKycHistory: UserKycHistory,
  ): Promise<IKycImageProcessResult> {
    const sumsubInfoHistory =
      await this.sumsubInfoHistoryService.findByUserKycHistoryId(
        userKycHistory.id,
      )
    return {
      provider: KycImageProvider.SUMSUB,
      resultStatus:
        sumsubInfoHistory?.reviewAnswer == SumsubReviewAnswer.GREEN
          ? KycProviderResultStatus.PASS
          : KycProviderResultStatus.FAIL,
      resultText: sumsubInfoHistory
        ? `${sumsubInfoHistory.reviewAnswer} ${
            sumsubInfoHistory.reviewRejectType || ''
          }`
        : '',
      compareStatus:
        sumsubInfoHistory?.compareStatus || CompareStatus.UNCERTAIN,
      livenessStatus:
        sumsubInfoHistory?.livenessStatus || LivenessStatus.UNKNOWN,
      identityDocumentVerificationStatus:
        sumsubInfoHistory?.identityDocumentVerificationStatus ||
        IdentityDocumentVerificationStatus.UNKNOWN,
      duplicateStatus:
        sumsubInfoHistory?.duplicateStatus || DuplicateStatus.UNKNOWN,
    }
  }
}
