import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import { EnterpriseInfo } from '@/models/user/EnterpriseInfo'
import {
  FindRelatedFaceDto,
  ICheckDuplicateIdDocumentNoRequest,
  ReviewOcrRequest,
  ReviewRiskRequest,
  UserKyc,
  UserKycAdminDecision,
} from '@/models/user/UserKyc'
import {
  ImageProcessResult,
  RekognitionInfoHistory,
  RekognitionInfoHistoryDetail,
  RelatedFaceDto,
  SumsubDetail,
  UserKycCynopsis,
} from '@/models/user/UserKycScanData'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class UserKycService {
  public static async findKycByUserId(
    userId: string,
  ): Promise<Optional<UserKyc>> {
    const response = await ApiService.get(`/user-kyc/detail`, {
      params: { user_id: userId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(UserKyc, response.data)
  }

  public static async findEnterpriseInfoByUserId(
    userId: string,
  ): Promise<Optional<EnterpriseInfo>> {
    const response = await ApiService.get(`/user-kyc/enterprise-info`, {
      params: { user_id: userId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(EnterpriseInfo, response.data)
  }

  public static async findCynopsisByKycHistoryId(
    userKycHistoryId: string,
  ): Promise<Optional<UserKycCynopsis>> {
    const response = await ApiService.get(`/user-kyc/cynopsis`, {
      params: { user_kyc_history_id: userKycHistoryId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(UserKycCynopsis, response.data)
  }

  public static async reviewOcr(data: ReviewOcrRequest) {
    const response = await ApiService.post(
      `/user-kyc/review-ocr`,
      instanceToPlain(data),
    )
    return response.data
  }

  public static async reviewRisk(data: ReviewRiskRequest) {
    const response = await ApiService.post(
      `/user-kyc/review-risk`,
      instanceToPlain(data),
    )
    return response.data
  }

  public static async checkDuplicateIdDocumentNo(
    data: ICheckDuplicateIdDocumentNoRequest,
  ) {
    const response = await ApiService.post(
      `/user-kyc/check-duplicate-id-document-no`,
      data,
    )
    return response.data
  }

  public static async rennewCynopsisData(userKycHistoryId: string) {
    const response = await ApiService.post(
      `/user-kyc/renew-cynopsis-data`,
      {},
      {
        params: { user_kyc_history_id: userKycHistoryId },
      },
    )
    return response.data
  }

  public static async findAdminDecisionByUserId(
    userId: string,
  ): Promise<UserKycAdminDecision[]> {
    const response = await ApiService.get(`/user-kyc/admin-decision`, {
      params: { user_id: userId },
    })
    if (response.status != HttpStatus.OK) {
      return []
    }
    return (response.data || []).map((e) =>
      plainToInstance(UserKycAdminDecision, e),
    )
  }

  public static async getImageProcessResultsByKycHistoryId(
    userKycHistoryId: string,
  ): Promise<ImageProcessResult[]> {
    const response = await ApiService.get(`/user-kyc/image-process-results`, {
      params: { user_kyc_history_id: userKycHistoryId },
    })
    if (response.status != HttpStatus.OK) {
      return []
    }
    return (response.data || []).map((e) =>
      plainToInstance(ImageProcessResult, e),
    )
  }

  public static async findRekognitionInfoHistoryByKycHistoryId(
    userKycHistoryId: string,
  ) {
    const response = await ApiService.get(`/user-kyc/amazon-rekognition`, {
      params: { user_kyc_history_id: userKycHistoryId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(RekognitionInfoHistory, response.data)
  }

  public static async findRekognitionInfoHistoryDetail(
    rekognitionInfoHistoryId: string,
  ) {
    const response = await ApiService.get(
      `/user-kyc/amazon-rekognition/${rekognitionInfoHistoryId}/detail`,
    )
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(RekognitionInfoHistoryDetail, response.data)
  }

  public static async findRelatedFaces(filter: FindRelatedFaceDto) {
    const response = await ApiService.get(
      `/user-kyc/amazon-rekognition/related-faces`,
      { params: instanceToPlain(filter) },
    )
    if (response.status != HttpStatus.OK) {
      return {
        data: [],
        pagination: {},
      }
    }
    const data = response.data
    data.data = (data.data || []).map((e) => plainToInstance(RelatedFaceDto, e))
    return data
  }

  public static async findRekognitionInfoHistoryWithUserInfo(params) {
    return await ApiService.get(`/user-kyc/amazon-rekognition/related-users`, {
      params,
    })
  }

  public static async getSumsubFileMapByKycHistoryId(userKycHistoryId: string) {
    const response = await ApiService.get(`/user-kyc/sumsub-filemap`, {
      params: { user_kyc_history_id: userKycHistoryId },
    })
    if (response.status != HttpStatus.OK) {
      return {}
    }
    return response.data || {}
  }

  public static async getSumsubDetailByKycHistoryId(userKycHistoryId: string) {
    const response = await ApiService.get(`/user-kyc/sumsub-detail`, {
      params: { user_kyc_history_id: userKycHistoryId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(SumsubDetail, response.data)
  }
}
