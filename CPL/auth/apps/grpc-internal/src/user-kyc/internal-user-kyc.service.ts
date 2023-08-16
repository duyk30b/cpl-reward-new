import { AdminAggregateService } from '@lib/admin-aggregate'
import { KycProviderService } from '@lib/kyc-provider'
import { UploadFileService } from '@lib/upload-file'
import { EnterpriseInfoService } from '@lib/user'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import { UserKycAdminService } from '@lib/user-kyc-admin'
import { UserKycCynopsisService } from '@lib/user-kyc-cynopsis'
import {
  RekognitionIndexService,
  RekognitionInfoHistoryService,
} from '@lib/user-kyc-rekognition'
import { IFindRekognitionInfoHistoryWithUserInfoFilter } from '@lib/user-kyc-rekognition/interfaces/rekognition-info-history.interface'
import { RekognitionRelatedFaceService } from '@lib/user-kyc-rekognition/services/rekognition-related-face.service'
import { RekognitionResponseService } from '@lib/user-kyc-rekognition/services/rekognition-response.service'
import { SumsubResponseService } from '@lib/user-kyc-sumsub/services/sumsub-response.service'
import { BusinessException } from '@lib/util'
import { IDataByUserId } from '@lib/util/util.interface'
import { Injectable } from '@nestjs/common'
import {
  ICheckDuplicateIdDocumentNoDto,
  IDataByKycHistoryId,
  IFindRelatedFaceRequest,
  IRejectKycDto,
  IReviewOcrDto,
  IReviewRiskDto,
} from './internal-user-kyc.interface'

@Injectable()
export class InternalUserKycService {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly enterpriseInfoService: EnterpriseInfoService,
    private readonly userKycCynopsisService: UserKycCynopsisService,
    private readonly uploadFileService: UploadFileService,
    private readonly adminAggregateService: AdminAggregateService,
    private readonly userKycAdminService: UserKycAdminService,
    private readonly rekognitionInfoHistoryService: RekognitionInfoHistoryService,
    private readonly rekognitionResponseService: RekognitionResponseService,
    private readonly rekognitionRelatedFaceService: RekognitionRelatedFaceService,
    private readonly rekognitionIndexService: RekognitionIndexService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly kycProviderService: KycProviderService,
    private readonly sumsubResponseService: SumsubResponseService,
  ) {}

  async findKycByUserId(userKycByUserId: IDataByUserId) {
    const result = await this.userKycService.getKycByUserId(
      userKycByUserId.userId,
    )
    if (result) {
      for (let i = 0; i < result.files.length; i++) {
        const file = result.files[i]
        file['path'] = await this.uploadFileService.getPublicUrl(file['name'])
      }
    }
    return { data: result }
  }

  async findEnterpriseInfoByUserId(enterpriseInfoByUserId: IDataByUserId) {
    const result = await this.enterpriseInfoService.getEnterpriseInfoByUserId(
      enterpriseInfoByUserId.userId,
    )
    if (result) {
      result.userRelatedParties = JSON.stringify(result.userRelatedParties)
    }
    return { data: result }
  }

  async findCynopsisByKycHistoryId(
    cynopsisByKycHistoryId: IDataByKycHistoryId,
  ) {
    const result = await this.userKycCynopsisService.getCynopsisByHistoryId(
      cynopsisByKycHistoryId.userKycHistoryId,
    )
    if (result) {
      result.cynopsisData = JSON.stringify(result.cynopsisData)
    }
    return { data: result }
  }

  async reviewOcr(reviewOcrDto: IReviewOcrDto) {
    try {
      await this.adminAggregateService.reviewOcr(reviewOcrDto)
      return { success: true }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: ICheckDuplicateIdDocumentNoDto,
  ) {
    return await this.userKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto.idDocumentNo,
      checkDuplicateIdDocumentNoDto.idDocumentType,
      checkDuplicateIdDocumentNoDto.countryId,
      checkDuplicateIdDocumentNoDto.exceptUserId,
    )
  }

  async reviewRisk(reviewRiskDto: IReviewRiskDto) {
    try {
      await this.adminAggregateService.reviewRisk(reviewRiskDto)
      return { success: true }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  async renewCynopsisData(userKycHistoryId: string) {
    return await this.adminAggregateService.renewCynopsisData(userKycHistoryId)
  }

  async findAdminDecisionByUserId(userId: string) {
    const result = await this.userKycAdminService.getListUserKycAdminDecision(
      userId,
    )
    return { data: result }
  }

  async getImageProcessResultsByKycHistoryId(userKycHistoryId: string) {
    const kycHistory = await this.userKycHistoryService.getById(
      userKycHistoryId,
    )
    if (!kycHistory) return { data: [] }

    const imageProviders = kycHistory.imageProviders.map((provider) =>
      this.kycProviderService.getImageProvider(provider),
    )

    const data = await Promise.all(
      imageProviders.map((imageProvider) =>
        imageProvider.getProcessResult(kycHistory),
      ),
    )

    return { data }
  }

  async findRekognitionInfoHistoryByKycHistoryId(userKycHistoryId: string) {
    const data = await this.rekognitionInfoHistoryService.findByKycHistoryId(
      userKycHistoryId,
    )

    if (!data) return { data }

    data['imageUrl'] = await this.uploadFileService.getPublicUrl(data.image)

    return { data }
  }

  async findRekognitionInfoHistoryDetail(rekognitionInfoHistoryId: string) {
    const data =
      await this.rekognitionResponseService.findByRekognitionInfoHistoryId(
        rekognitionInfoHistoryId,
      )
    if (data) {
      const jsonFields = [
        'compareResponse',
        'relatedFacesResponse',
        'faceIndexResponse',
      ]
      jsonFields.forEach((field) => {
        data[field] = JSON.stringify(data[field])
      })
    }
    return { data }
  }

  async findRelatedFaces(findRelatedFaceRequest: IFindRelatedFaceRequest) {
    const relatedFaces =
      await this.rekognitionRelatedFaceService.findRelatedFaces(
        findRelatedFaceRequest,
      )
    for (let i = 0; i < relatedFaces.data.length; i++) {
      const face = relatedFaces.data[i]
      const index = await this.rekognitionIndexService.findOneByFaceId(
        face.faceId,
      )
      if (!index) continue
      face.detail = JSON.stringify(index.sampleIndexResponse)
      face.imageUrl = await this.uploadFileService.getPublicUrl(
        index.sampleImage,
      )
    }
    return relatedFaces
  }

  async findRekognitionInfoHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    return await this.rekognitionInfoHistoryService.findHistoryWithUserInfo(
      filter,
    )
  }

  async rejectKyc(rejectKycDto: IRejectKycDto) {
    try {
      await this.adminAggregateService.rejectKyc(rejectKycDto)
      return { success: true }
    } catch (e) {
      if (e instanceof BusinessException) {
        return {
          success: false,
          errorCode: e.getSubErrorCode(),
          message: e.getMessage(),
        }
      } else {
        return {
          success: false,
          message: e.message,
        }
      }
    }
  }

  async getSumsubFileMapByKycHistoryId(userKycHistoryId: string) {
    const sumsubResponse =
      await this.sumsubResponseService.findByUserKycHistoryId(userKycHistoryId)
    if (!sumsubResponse) return { data: {} }
    const data = {}
    const fileMap = sumsubResponse.fileMap
    const sumsubFileIds = Object.keys(fileMap)
    for (const sumsubFileId of sumsubFileIds) {
      const link = await this.uploadFileService.getPublicUrl(
        fileMap[sumsubFileId].name,
      )
      data[sumsubFileId] = link
    }
    return { data }
  }

  async getSumsubDetailByKycHistoryId(userKycHistoryId: string) {
    const sumsubResponse =
      await this.sumsubResponseService.findByUserKycHistoryId(userKycHistoryId)
    if (!sumsubResponse) return {}
    const jsonKey = [
      'applicantResponse',
      'inspectionResponse',
      'applicantStatusResponse',
      'applicantDocsStatusResponse',
      'similarApplicantsResponse',
    ]
    jsonKey.forEach((key) => {
      sumsubResponse[key] = JSON.stringify(sumsubResponse[key])
    })
    return sumsubResponse
  }
}
