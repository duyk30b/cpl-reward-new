import { Injectable, Logger } from '@nestjs/common'
import { AuthSettingService } from '@lib/auth-setting'
import { UserInfoService, UserService } from '@lib/user'
import {
  KycIdDocumentMetadata,
  KycIdDocumentType,
  KycStatus,
  KycType,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { UserInfoStatus, UserKycVerifyStatus } from '@lib/user/enum/user.enum'
import { UserKycService, UserKycHistoryService } from '@lib/user-kyc'
import {
  ISumsubApplicantPendingEvent,
  ISumsubApplicantReviewedEvent,
  RedisQueueService,
} from '@lib/redis-queue'
import {
  ISumsubImage,
  SumsubApplicantType,
  SumsubIdDocSubType,
  SumsubIdDocType,
  SumsubService,
} from '@lib/sumsub'
import { SumsubResponseService } from '@lib/user-kyc-sumsub/services/sumsub-response.service'
import { FlowAction } from '@lib/flows/enum/flows.enum'
import { ISumsubFileMap } from '@lib/user-kyc-sumsub/user-kyc-sumsub.type'
import { FlowService } from '@lib/flows'
import { FileService } from '@lib/upload-file'

@Injectable()
export class WorkerSumsubService {
  private readonly logger = new Logger(WorkerSumsubService.name)

  constructor(
    private readonly userKycService: UserKycService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly userService: UserService,
    private readonly authSettingService: AuthSettingService,
    private readonly redisQueueService: RedisQueueService,
    private readonly sumsubResponseService: SumsubResponseService,
    private readonly sumsubService: SumsubService,
    private readonly userInfoService: UserInfoService,
    private readonly flowService: FlowService,
    private readonly fileService: FileService,
  ) {}

  async handleSumsubApplicantPending(data: ISumsubApplicantPendingEvent) {
    const { userId, applicantType } = data
    this.logger.log(`Start pending hook for user id: ${userId}`)

    const user = await this.userService.getUserById(userId)
    if (!user) {
      this.logger.error(`Can not find user ${userId}`)
      return
    }

    const { pending: userHavePendingKyc } =
      await this.userKycService.checkUserHavePendingKyc(userId)
    if (userHavePendingKyc) {
      this.logger.error(`User ${userId} have pending kyc`)
      return
    }

    if (user.userInfoStatus != UserInfoStatus.UPDATED) {
      this.logger.error(`User ${userId} does not have info`)
      return
    }

    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    if (!userInfo) {
      this.logger.error(`User ${userId} does not have info`)
      return
    }

    const applicant = await this.sumsubService.getApplicantData(userId)
    if (!applicant) {
      this.logger.error(`User ${userId} does not have applicant info`)
      return
    }

    const { inspectionId } = applicant

    let inspection = await this.sumsubService.getUserInspection(inspectionId)
    if (!inspection) {
      this.logger.error(`User ${userId} does not have inspection info`)
      return
    }

    inspection = this.sumsubService.getCurrentImagesAndChecks(inspection)

    const sumsubFileMap = await this.sumsubService.uploadAllImagesFromSumsub({
      inspection,
    })

    let kycImages = inspection.images
    const applicantDocsStatus = await this.sumsubService.getApplicantDocsStatus(
      applicant.id,
    )
    if (applicantDocsStatus) {
      const imageIds = [
        ...(applicantDocsStatus.IDENTITY?.imageIds || []),
        ...(applicantDocsStatus.SELFIE?.imageIds || []),
      ]
      kycImages = kycImages.filter((image) => imageIds.includes(image.imageId))
    }

    const kycFiles = await this.saveKycFilesFromSumsub(
      userId,
      kycImages,
      sumsubFileMap,
    )

    const kycSetting = await this.authSettingService.getKycSetting()

    const idDoc = applicant.info?.idDocs?.length
      ? applicant.info.idDocs[applicant.info.idDocs.length - 1]
      : null

    const userKycDto = {
      userId: userId,
      files: kycFiles,
      type:
        applicantType == SumsubApplicantType.COMPANY
          ? KycType.ENTERPRISE
          : KycType.PERSONAL,
      imageProvider: 0,
      riskScanProvider: 0,
      imageProviders:
        applicantType == SumsubApplicantType.COMPANY
          ? kycSetting.enterpriseImageProviders
          : kycSetting.personalImageProviders,
      riskScanProviders:
        applicantType == SumsubApplicantType.COMPANY
          ? kycSetting.enterpriseRiskScanProviders
          : kycSetting.personalRiskScanProviders,
      idDocumentType: this.getIdDocumentType(idDoc?.idDocType),
      idDocumentNo: idDoc?.number || '',
      countryId: userInfo.countryId,
    }

    const history = await this.userKycHistoryService.saveUserKycHistory({
      ...userKycDto,
      userInfoHistoryId: userInfo.userInfoHistoryId,
      isModifiedByUser: true,
    })

    await this.userKycService.saveUserKyc({
      ...userKycDto,
      userKycHistoryId: history.id,
      status: KycStatus.NEW,
    })

    await this.userService.updateKycVerifyStatus(
      userId,
      UserKycVerifyStatus.PENDING,
    )

    await this.userService.updateLv(userId, 3, true)

    await this.flowService.completeFlow(FlowAction.user_kyc, userId)

    await this.sumsubResponseService.upsertSumsubResponse(history.id, {
      applicantResponse: applicant,
      fileMap: sumsubFileMap,
    })
    this.logger.log(`Done pending hook for user id: ${userId}`)
  }

  async handleSumsubApplicantReviewed(data: ISumsubApplicantReviewedEvent) {
    const { userId } = data
    this.logger.log(`Start sumsub reviewed hook for user id: ${userId}`)

    const userKyc = await this.userKycService.getKycByUserId(userId)
    if (!userKyc) {
      this.logger.error(`User ${userId} does not have kyc record`)
      throw new Error(`User ${userId} does not have kyc record`)
    }

    if (userKyc.status != KycStatus.NEW) {
      this.logger.error(`User ${userId} kyc status is invalid`)
      // throw new Error(`User ${userId} kyc status is invalid`)
      return
    }

    const applicant = await this.sumsubService.getApplicantData(userId)
    if (!applicant) {
      this.logger.error(`User ${userId} does not have applicant info`)
      throw new Error(`User ${userId} does not have applicant info`)
    }

    let inspection = await this.sumsubService.getUserInspection(
      applicant.inspectionId,
    )
    if (!inspection) {
      this.logger.error(`User ${userId} does not have inspection info`)
      throw new Error(`User ${userId} does not have inspection info`)
    }

    const idDoc = applicant.info?.idDocs?.length
      ? applicant.info.idDocs[applicant.info.idDocs.length - 1]
      : null
    const idDocumentNo = idDoc?.number

    if (idDocumentNo) {
      await this.userKycHistoryService.updateIdDocumentNo(
        userKyc.userKycHistoryId,
        idDocumentNo,
      )
      await this.userKycService.updateIdDocumentNo(userId, idDocumentNo)
    }

    const [applicantDocsStatus, applicantStatus, similarApplicantsResponse] =
      await Promise.all([
        this.sumsubService.getApplicantDocsStatus(applicant.id),
        this.sumsubService.getApplicantStatus(applicant.id),
        this.sumsubService.getSimilarApplicants(applicant.id),
      ])

    const sumsubResponse =
      await this.sumsubResponseService.findByUserKycHistoryId(
        userKyc.userKycHistoryId,
      )

    inspection = this.sumsubService.getCurrentImagesAndChecks(inspection)

    const sumsubFileMap = await this.sumsubService.uploadAllImagesFromSumsub(
      {
        inspection,
        similarApplicants: similarApplicantsResponse?.similarApplicants,
      },
      sumsubResponse?.fileMap,
    )

    await this.sumsubResponseService.upsertSumsubResponse(
      userKyc.userKycHistoryId,
      {
        applicantResponse: applicant,
        inspectionResponse: inspection,
        applicantDocsStatusResponse: applicantDocsStatus,
        applicantStatusResponse: applicantStatus,
        similarApplicantsResponse: similarApplicantsResponse,
        fileMap: sumsubFileMap,
      },
    )

    this.redisQueueService.addKycRegisteredJob(userId)

    this.logger.log(`Done sumsub reviewed hook for user id: ${userId}`)
  }

  private async saveKycFilesFromSumsub(
    userId: string,
    images: ISumsubImage[],
    fileMap: ISumsubFileMap,
  ) {
    const promises = images.map((image) =>
      this.saveKycFileFromSumsub(userId, image, fileMap),
    )

    const files = await Promise.all(promises)
    return files.filter((file) => !!file)
  }

  private async saveKycFileFromSumsub(
    userId: string,
    image: ISumsubImage,
    fileMap: ISumsubFileMap,
  ) {
    const file = fileMap[image.imageId]
    if (!file) return
    return await this.fileService.create({
      ...file,
      userId,
      metadata: this.getKycIdDocumentMetadata(image),
      isImage: true,
    })
  }

  private getKycIdDocumentMetadata(image: ISumsubImage) {
    const { idDocType, idDocSubType } = image.idDocDef
    switch (idDocType) {
      case SumsubIdDocType.ID_CARD:
        if (idDocSubType == SumsubIdDocSubType.BACK_SIDE) {
          return KycIdDocumentMetadata.ID_CARD_BACK
        }
        return KycIdDocumentMetadata.ID_CARD_FRONT
      case SumsubIdDocType.PASSPORT:
        return KycIdDocumentMetadata.PASSPORT
      case SumsubIdDocType.SELFIE:
        return KycIdDocumentMetadata.SELFIE
      case SumsubIdDocType.DRIVERS:
        if (idDocSubType == SumsubIdDocSubType.BACK_SIDE) {
          return KycIdDocumentMetadata.DRIVING_LICENCE_BACK
        }
        return KycIdDocumentMetadata.DRIVING_LICENCE_FRONT
      case SumsubIdDocType.RESIDENCE_PERMIT:
        if (idDocSubType == SumsubIdDocSubType.BACK_SIDE) {
          return KycIdDocumentMetadata.RESIDENCE_CARD_BACK
        }
        return KycIdDocumentMetadata.RESIDENCE_CARD_FRONT
      default:
        return KycIdDocumentMetadata.OTHERS
    }
  }

  private getIdDocumentType(sumsubIdDocType: SumsubIdDocType) {
    switch (sumsubIdDocType) {
      case SumsubIdDocType.ID_CARD:
        return KycIdDocumentType.ID_CARD
      case SumsubIdDocType.DRIVERS:
        return KycIdDocumentType.DRIVING_LICENCE
      case SumsubIdDocType.PASSPORT:
        return KycIdDocumentType.PASSPORT
      case SumsubIdDocType.RESIDENCE_PERMIT:
        return KycIdDocumentType.RESIDENCE_CARD
      default:
        return KycIdDocumentType.OTHERS
    }
  }
}
