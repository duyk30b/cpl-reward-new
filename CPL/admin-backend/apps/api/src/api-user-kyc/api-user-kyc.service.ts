import { AdminService } from '@lib/admin'
import {
  IFindRekognitionInfoHistoryWithUserInfoFilter,
  IFindRelatedFace,
  UserKycService,
} from '@lib/grpc-client/user-kyc'
import { Injectable } from '@nestjs/common'
import {
  CheckDuplicateIdDocumentNoDto,
  ReviewOcrDto,
  ReviewRiskDto,
} from './api-user-kyc.dto'

@Injectable()
export class ApiUserKycService {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly adminService: AdminService,
  ) {}

  async findKycByUserId(userId: string) {
    return await this.userKycService.findKycByUserId(userId)
  }

  async findEnterpriseInfoByUserId(userId: string) {
    return await this.userKycService.findEnterpriseInfoByUserId(userId)
  }

  async findCynopsisByKycHistoryId(userKycHistoryId: string) {
    return await this.userKycService.findCynopsisByKycHistoryId(
      userKycHistoryId,
    )
  }

  async reviewOcr(reviewOcrDto: ReviewOcrDto, adminId: string) {
    return await this.userKycService.reviewOcr({ ...reviewOcrDto, adminId })
  }

  async reviewRisk(reviewRiskDto: ReviewRiskDto, adminId: string) {
    return await this.userKycService.reviewRisk({ ...reviewRiskDto, adminId })
  }

  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
  ) {
    return await this.userKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
    )
  }

  async renewCynopsisData(userKycHistoryId: string) {
    return await this.userKycService.renewCynopsisData(userKycHistoryId)
  }

  async findAdminDecisionByUserId(userId: string) {
    const decisions = await this.userKycService.findAdminDecisionByUserId(
      userId,
    )
    const adminIds = decisions
      .map((decision) => decision.adminId)
      .filter((adminId) => !!adminId)

    const admins = await this.adminService.getAdminByIds(adminIds)

    decisions.forEach((decision) => {
      if (decision.adminId) {
        const admin = admins.find((e) => e.id == decision.adminId)
        decision.admin = admin
      }
    })
    return decisions
  }

  async getImageProcessResultsByKycHistoryId(userKycHistoryId: string) {
    return await this.userKycService.getImageProcessResultsByKycHistoryId(
      userKycHistoryId,
    )
  }

  async findRekognitionInfoHistoryByKycHistoryId(userKycHistoryId: string) {
    return await this.userKycService.findRekognitionInfoHistoryByKycHistoryId(
      userKycHistoryId,
    )
  }

  async findRekognitionInfoHistoryDetail(rekognitionInfoHistoryId: string) {
    return await this.userKycService.findRekognitionInfoHistoryDetail(
      rekognitionInfoHistoryId,
    )
  }

  async findRelatedFaces(filter: IFindRelatedFace) {
    return await this.userKycService.findRelatedFaces(filter)
  }

  async findRekognitionInfoHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    return await this.userKycService.findRekognitionInfoHistoryWithUserInfo(
      filter,
    )
  }

  async getSumsubFileMapByKycHistoryId(userKycHistoryId: string) {
    return await this.userKycService.getSumsubFileMapByKycHistoryId(
      userKycHistoryId,
    )
  }

  async getSumsubDetailByKycHistoryId(userKycHistoryId: string) {
    return await this.userKycService.getSumsubDetailByKycHistoryId(
      userKycHistoryId,
    )
  }
}
