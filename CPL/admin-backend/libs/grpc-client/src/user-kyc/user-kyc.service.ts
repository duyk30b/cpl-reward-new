import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import {
  ICheckDuplicateIdDocumentNoDto,
  IFindRekognitionInfoHistoryWithUserInfoFilter,
  IFindRelatedFace,
  IRejectKycDto,
  IReviewRiskDto,
  IUserKycService,
} from './user-kyc.interface'
import {
  EnterpriseInfoDto,
  ImageProcessResultDto,
  RekognitionInfoHistoryDetailDto,
  RekognitionInfoHistoryDto,
  RekognitionInfoHistoryWithUserInfo,
  RelatedFaceDto,
  SumsubDetailDto,
  UserKycAdminDecisionDto,
  UserKycCynopsisDto,
  UserKycDto,
} from './user-kyc.dto'
import { IReviewOcrDto } from '.'

@Injectable()
export class UserKycService {
  private service: IUserKycService
  constructor(@Inject('USER_KYC_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<IUserKycService>('UserKycService')
  }

  async findKycByUserId(userId: string) {
    const req = this.service.findKycByUserId({ userId })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(UserKycDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async findEnterpriseInfoByUserId(userId: string) {
    const req = this.service.findEnterpriseInfoByUserId({ userId })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(EnterpriseInfoDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async findCynopsisByKycHistoryId(userKycHistoryId: string) {
    const req = this.service.findCynopsisByKycHistoryId({ userKycHistoryId })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(UserKycCynopsisDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async reviewOcr(reviewOcrDto: IReviewOcrDto) {
    const req = this.service.reviewOcr(reviewOcrDto)
    return await lastValueFrom(req)
  }

  async reviewRisk(reviewRiskDto: IReviewRiskDto) {
    const req = this.service.reviewRisk(reviewRiskDto)
    return await lastValueFrom(req)
  }

  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: ICheckDuplicateIdDocumentNoDto,
  ) {
    const req = this.service.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
    )
    return await lastValueFrom(req)
  }

  async renewCynopsisData(userKycHistoryId: string) {
    const req = this.service.renewCynopsisData({ userKycHistoryId })
    const result = await lastValueFrom(req)
    return result
  }

  async findAdminDecisionByUserId(userId: string) {
    const req = this.service.findAdminDecisionByUserId({ userId })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(UserKycAdminDecisionDto, result.data, {
          ignoreDecorators: true,
        })
      : []
  }

  async getImageProcessResultsByKycHistoryId(userKycHistoryId: string) {
    const req = this.service.getImageProcessResultsByKycHistoryId({
      userKycHistoryId,
    })
    const result = await lastValueFrom(req)
    return (result.data || []).map((e) =>
      plainToInstance(ImageProcessResultDto, e, {
        ignoreDecorators: true,
      }),
    )
  }

  async findRekognitionInfoHistoryByKycHistoryId(userKycHistoryId: string) {
    const req = this.service.findRekognitionInfoHistoryByKycHistoryId({
      userKycHistoryId,
    })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(RekognitionInfoHistoryDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async findRekognitionInfoHistoryDetail(rekognitionInfoHistoryId: string) {
    const req = this.service.findRekognitionInfoHistoryDetail({
      rekognitionInfoHistoryId,
    })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(RekognitionInfoHistoryDetailDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async findRelatedFaces(filter: IFindRelatedFace) {
    const req = this.service.findRelatedFaces(filter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(RelatedFaceDto, item, { ignoreDecorators: true }),
    )
    return data
  }

  async findRekognitionInfoHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    const req = this.service.findRekognitionInfoHistoryWithUserInfo(filter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(RekognitionInfoHistoryWithUserInfo, item, {
        ignoreDecorators: true,
      }),
    )
    return data
  }

  async rejectKyc(rejectKycDto: IRejectKycDto) {
    const req = this.service.rejectKyc(rejectKycDto)
    return await lastValueFrom(req)
  }

  async getSumsubFileMapByKycHistoryId(userKycHistoryId: string) {
    const req = this.service.getSumsubFileMapByKycHistoryId({
      userKycHistoryId,
    })
    const result = await lastValueFrom(req)
    return result.data
  }

  async getSumsubDetailByKycHistoryId(userKycHistoryId: string) {
    const req = this.service.getSumsubDetailByKycHistoryId({
      userKycHistoryId,
    })
    const result = await lastValueFrom(req)
    return plainToInstance(SumsubDetailDto, result, {
      ignoreDecorators: true,
    })
  }
}
