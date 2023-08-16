/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { getFaceFile, getFrontDocumentFile } from '@lib/util'
import { AmazonRekognitionService } from '@lib/amazon-rekognition'
import { IUpdateRekognitionResponse } from '@lib/user-kyc-rekognition/interfaces/rekognition-response.interface'
import {
  RekognitionIndexService,
  RekognitionInfoHistory,
  RekognitionInfoHistoryService,
  RekognitionInfoService,
  RekognitionRelatedFaceService,
  RekognitionResponseService,
} from '@lib/user-kyc-rekognition'
import {
  IKycImageProcessResult,
  IKycImageProviderService,
  KycProviderDecision,
} from '../kyc-provider.type'
import { ConfigService } from '@nestjs/config'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  DuplicateStatus,
  KycImageProvider,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { AuthSettingService } from '@lib/auth-setting'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserService } from '@lib/user'
import { UserStatus } from '@lib/user/enum/user.enum'

@Injectable()
export class AmazonKycService
  implements OnModuleInit, IKycImageProviderService
{
  private readonly logger = new Logger(AmazonKycService.name)
  private readonly kycFaceCollection: string

  constructor(
    private readonly configService: ConfigService,
    private readonly amazonRekognitionService: AmazonRekognitionService,
    private readonly rekognitionInfoService: RekognitionInfoService,
    private readonly rekognitionInfoHistoryService: RekognitionInfoHistoryService,
    private readonly rekognitionIndexService: RekognitionIndexService,
    private readonly rekognitionRelatedFaceService: RekognitionRelatedFaceService,
    private readonly rekognitionResponseService: RekognitionResponseService,
    private readonly authSettingService: AuthSettingService,
    private readonly userService: UserService,
  ) {
    this.kycFaceCollection = this.configService.get(
      'kyc.rekognition_face_collection',
    )
  }

  async onModuleInit() {
    await this.amazonRekognitionService.createCollectionIfNotExist(
      this.kycFaceCollection,
    )
  }

  async process(userKyc: UserKyc) {
    const rekognitionInfoHistory =
      await this.rekognitionInfoHistoryService.createRekognitionInfoHistoryForKyc(
        userKyc,
      )

    await this.compareFaceVsDocument(userKyc, rekognitionInfoHistory)

    const faceId = await this.indexFace(userKyc, rekognitionInfoHistory)

    await this.hasRelatedFaces(faceId, rekognitionInfoHistory)
  }

  private async compareFaceVsDocument(
    userKyc: UserKyc,
    rekognitionInfoHistory: RekognitionInfoHistory,
  ) {
    const faceFile = getFaceFile(userKyc)
    const frontDocumentFile = getFrontDocumentFile(userKyc)
    const rekognitionResponse: IUpdateRekognitionResponse = {}

    let compareStatus = CompareStatus.UNCERTAIN
    if (!faceFile || !frontDocumentFile) {
      compareStatus = CompareStatus.ERROR
      rekognitionResponse.compareError = 'File is missing'
    } else {
      try {
        const kycSetting = await this.authSettingService.getKycSetting()
        const compareFaceResponse =
          await this.amazonRekognitionService.compareFaces(
            faceFile.name,
            frontDocumentFile.name,
            kycSetting.compareFaceThreshold,
          )
        rekognitionResponse.compareResponse = compareFaceResponse
        compareStatus = compareFaceResponse.FaceMatches?.length
          ? CompareStatus.MATCHED
          : CompareStatus.NOT_MATCHED
      } catch (e) {
        rekognitionResponse.compareError = e.stack
        compareStatus = CompareStatus.ERROR
      }
    }

    await this.rekognitionInfoHistoryService.updateCompareStatusForKyc(
      userKyc,
      compareStatus,
    )

    await this.rekognitionResponseService.upsertRekognitionResponse(
      rekognitionInfoHistory.id,
      rekognitionResponse,
    )

    return compareStatus == CompareStatus.MATCHED
  }

  private async indexFace(
    userKyc: UserKyc,
    rekognitionInfoHistory: RekognitionInfoHistory,
  ) {
    const faceFile = getFaceFile(userKyc)
    const rekognitionResponse: IUpdateRekognitionResponse = {}

    let faceId = null
    if (faceFile) {
      try {
        const faceIndexResponse =
          await this.amazonRekognitionService.addFaceToCollection(
            faceFile.name,
            this.kycFaceCollection,
          )
        rekognitionResponse.faceIndexResponse = faceIndexResponse
        faceId = faceIndexResponse?.FaceRecords?.[0]?.Face?.FaceId
      } catch (e) {
        rekognitionResponse.faceIndexError = e.stack
      }
    } else {
      rekognitionResponse.faceIndexError = 'Face file is missing'
    }

    if (faceId) {
      await this.rekognitionInfoHistoryService.updateFaceIdForKyc(
        userKyc,
        faceId,
      )

      await this.rekognitionIndexService.create({
        faceId,
        sampleImage: faceFile.name,
        sampleIndexResponse: rekognitionResponse.faceIndexResponse,
      })
    }

    await this.rekognitionInfoService.upsertRekognitionInfo(userKyc.userId, {
      faceId,
      image: faceFile.name,
    })

    await this.rekognitionResponseService.upsertRekognitionResponse(
      rekognitionInfoHistory.id,
      rekognitionResponse,
    )

    return faceId
  }

  private async hasRelatedFaces(
    faceId: string,
    rekognitionInfoHistory: RekognitionInfoHistory,
  ) {
    let duplicateStatus = DuplicateStatus.UNKNOWN
    if (faceId) {
      const kycSetting = await this.authSettingService.getKycSetting()
      // Check xem có user khác cùng faceId không
      const isFaceIdDuplicate =
        await this.rekognitionInfoHistoryService.findOneByFaceId(
          faceId,
          rekognitionInfoHistory.userId,
        )

      // Reject nếu có khuôn mặt tương tự với threshold cao
      const rejectDuplicate = await this.hasRelatedFaceOfOtherUsers(
        faceId,
        kycSetting.maxFacesFind,
        kycSetting.duplicateFaceAutoRejectThreshold,
        rekognitionInfoHistory,
      )

      if (!rejectDuplicate) {
        // Warning nếu có khuôn mặt tương tự với threshold thấp
        const warningDuplicate = await this.hasRelatedFaceOfOtherUsers(
          faceId,
          kycSetting.maxFacesFind,
          kycSetting.duplicateFaceWarningThreshold,
          rekognitionInfoHistory,
        )

        duplicateStatus = warningDuplicate
          ? DuplicateStatus.WARNING
          : DuplicateStatus.NOT_DUPLICATE
      } else {
        duplicateStatus = DuplicateStatus.HAVE_DUPLICATE
      }

      if (isFaceIdDuplicate) {
        duplicateStatus = DuplicateStatus.HAVE_DUPLICATE
      }
    }

    await this.rekognitionInfoHistoryService.updateDuplicateStatusForKycHistory(
      rekognitionInfoHistory.userKycHistoryId,
      duplicateStatus,
    )

    return (
      duplicateStatus == DuplicateStatus.HAVE_DUPLICATE ||
      duplicateStatus == DuplicateStatus.UNKNOWN
    )
  }

  private async hasRelatedFaceOfOtherUsers(
    faceId: string,
    maxFaces: number,
    threshold: number,
    rekognitionInfoHistory: RekognitionInfoHistory,
  ) {
    const rekognitionResponse: IUpdateRekognitionResponse = {}
    let relatedFaceIds = []
    try {
      const relatedFacesResponse =
        await this.amazonRekognitionService.findRelatedFace(
          faceId,
          this.kycFaceCollection,
          maxFaces,
          threshold,
        )
      const faceMatches = relatedFacesResponse?.FaceMatches || []

      rekognitionResponse.relatedFacesResponse = relatedFacesResponse

      relatedFaceIds = faceMatches.map((face) => face.Face.FaceId)

      for (let i = 0; i < faceMatches.length; i++) {
        const face = faceMatches[i]
        if (!face?.Face?.FaceId) continue
        await this.rekognitionRelatedFaceService.saveRelatedFace(
          faceId,
          face?.Face?.FaceId,
          face.Similarity,
        )
      }
    } catch (e) {
      rekognitionResponse.relatedFacesError = e.stack
    }

    const hasRelatedFaceOfOtherUsers =
      await this.rekognitionInfoHistoryService.findOneByFaceIds(
        relatedFaceIds,
        rekognitionInfoHistory.userId,
      )

    await this.rekognitionResponseService.upsertRekognitionResponse(
      rekognitionInfoHistory.id,
      rekognitionResponse,
    )

    return hasRelatedFaceOfOtherUsers
  }

  async deleteFaceIndex(userKycHistory: UserKycHistory) {
    // const rekognitionInfoHistory =
    //   await this.rekognitionInfoHistoryService.findByKycHistoryId(
    //     userKycHistory.id,
    //   )
    // if (!rekognitionInfoHistory) return
    // const { faceId, userId } = rekognitionInfoHistory
    // if (!faceId) return
    // const otherInfosWithSameFaceId =
    //   await this.rekognitionInfoHistoryService.findByFaceId(faceId, userId)
    // const otherUserIds = otherInfosWithSameFaceId.map((info) => info.userId)
    // const otherUsers = await this.userService.getUserByIds(otherUserIds)
    // const faceIdUsedByOtherUser = otherUsers.some(
    //   (user) => user.status == UserStatus.ACTIVE,
    // )
    // if (faceIdUsedByOtherUser) return
    // await this.amazonRekognitionService.deleteFaceFromCollection(
    //   faceId,
    //   this.kycFaceCollection,
    // )
  }

  async getFinalDecision(userKyc: UserKyc): Promise<KycProviderDecision> {
    const rekognitionInfoHistory =
      await this.rekognitionInfoHistoryService.findByKycHistoryId(
        userKyc.userKycHistoryId,
      )

    if (
      rekognitionInfoHistory &&
      rekognitionInfoHistory.compareStatus == CompareStatus.MATCHED &&
      rekognitionInfoHistory.faceId &&
      (rekognitionInfoHistory.duplicateStatus ==
        DuplicateStatus.NOT_DUPLICATE ||
        rekognitionInfoHistory.duplicateStatus == DuplicateStatus.WARNING)
    ) {
      return KycProviderDecision.AUTO_KYC_PASS
    }

    return KycProviderDecision.AUTO_KYC_REJECT
  }

  getBestDecision(): KycProviderDecision {
    return KycProviderDecision.AUTO_KYC_PASS
  }

  async logicAfterReject(userKyc: UserKyc): Promise<void> {
    return
  }

  async getProcessResult(
    userKycHistory: UserKycHistory,
  ): Promise<IKycImageProcessResult> {
    const rekogniionInfoHistory =
      await this.rekognitionInfoHistoryService.findByKycHistoryId(
        userKycHistory.id,
      )
    return {
      provider: KycImageProvider.AMAZON,
      compareStatus:
        rekogniionInfoHistory?.compareStatus || CompareStatus.UNCERTAIN,
      duplicateStatus:
        rekogniionInfoHistory?.duplicateStatus || DuplicateStatus.UNKNOWN,
    }
  }
}
