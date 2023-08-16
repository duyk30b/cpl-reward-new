import { IFindRekognitionInfoHistoryWithUserInfoFilter } from '@lib/user-kyc-rekognition/interfaces/rekognition-info-history.interface'
import { IDataByUserId } from '@lib/util/util.interface'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  ICheckDuplicateIdDocumentNoDto,
  IDataByKycHistoryId,
  IDataByRekognitionInfoHistoryId,
  IFindRelatedFaceRequest,
  IRejectKycDto,
  IReviewOcrDto,
  IReviewRiskDto,
} from './internal-user-kyc.interface'
import { InternalUserKycService } from './internal-user-kyc.service'

@Controller()
export class InternalUserKycController {
  constructor(
    private readonly internalUserKycService: InternalUserKycService,
  ) {}

  @GrpcMethod('UserKycService')
  async findKycByUserId(userKycByUserId: IDataByUserId) {
    return await this.internalUserKycService.findKycByUserId(userKycByUserId)
  }

  @GrpcMethod('UserKycService')
  async findEnterpriseInfoByUserId(enterpriseInfoByUserId: IDataByUserId) {
    return await this.internalUserKycService.findEnterpriseInfoByUserId(
      enterpriseInfoByUserId,
    )
  }

  @GrpcMethod('UserKycService')
  async findCynopsisByKycHistoryId(
    cynopsisByKycHistoryId: IDataByKycHistoryId,
  ) {
    return await this.internalUserKycService.findCynopsisByKycHistoryId(
      cynopsisByKycHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async reviewOcr(reviewOcrDto: IReviewOcrDto) {
    return await this.internalUserKycService.reviewOcr(reviewOcrDto)
  }

  @GrpcMethod('UserKycService')
  async reviewRisk(reviewRiskDto: IReviewRiskDto) {
    return await this.internalUserKycService.reviewRisk(reviewRiskDto)
  }

  @GrpcMethod('UserKycService')
  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: ICheckDuplicateIdDocumentNoDto,
  ) {
    const exist = await this.internalUserKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
    )
    return { valid: !exist }
  }

  @GrpcMethod('UserKycService')
  async renewCynopsisData(dataByKycHistory: IDataByKycHistoryId) {
    return await this.internalUserKycService.renewCynopsisData(
      dataByKycHistory.userKycHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async findAdminDecisionByUserId(dataByUserId: IDataByUserId) {
    return await this.internalUserKycService.findAdminDecisionByUserId(
      dataByUserId.userId,
    )
  }

  @GrpcMethod('UserKycService')
  async getImageProcessResultsByKycHistoryId(
    dataByKycHistoryId: IDataByKycHistoryId,
  ) {
    return await this.internalUserKycService.getImageProcessResultsByKycHistoryId(
      dataByKycHistoryId.userKycHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async findRekognitionInfoHistoryByKycHistoryId(
    dataByKycHistory: IDataByKycHistoryId,
  ) {
    return await this.internalUserKycService.findRekognitionInfoHistoryByKycHistoryId(
      dataByKycHistory.userKycHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async findRekognitionInfoHistoryDetail(
    dataByRekognitionInfoHistoryId: IDataByRekognitionInfoHistoryId,
  ) {
    return await this.internalUserKycService.findRekognitionInfoHistoryDetail(
      dataByRekognitionInfoHistoryId.rekognitionInfoHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async findRelatedFaces(findRelatedFaceRequest: IFindRelatedFaceRequest) {
    return await this.internalUserKycService.findRelatedFaces(
      findRelatedFaceRequest,
    )
  }

  @GrpcMethod('UserKycService')
  async findRekognitionInfoHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    return await this.internalUserKycService.findRekognitionInfoHistoryWithUserInfo(
      filter,
    )
  }

  @GrpcMethod('UserKycService')
  async rejectKyc(rejectKycDto: IRejectKycDto) {
    return await this.internalUserKycService.rejectKyc(rejectKycDto)
  }

  @GrpcMethod('UserKycService')
  async getSumsubFileMapByKycHistoryId(dataByKycHistory: IDataByKycHistoryId) {
    return await this.internalUserKycService.getSumsubFileMapByKycHistoryId(
      dataByKycHistory.userKycHistoryId,
    )
  }

  @GrpcMethod('UserKycService')
  async getSumsubDetailByKycHistoryId(dataByKycHistory: IDataByKycHistoryId) {
    return await this.internalUserKycService.getSumsubDetailByKycHistoryId(
      dataByKycHistory.userKycHistoryId,
    )
  }
}
