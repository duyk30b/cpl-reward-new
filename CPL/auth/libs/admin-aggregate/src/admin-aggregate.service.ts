import { AmazonCognitoService } from '@lib/amazon-cognito'
import { ArtemisService } from '@lib/artemis'
import { RedisQueueService } from '@lib/redis-queue'
import { UploadFileService } from '@lib/upload-file'
import { UserInfoHistoryService, UserInfoService, UserService } from '@lib/user'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import { UserKycAdminService } from '@lib/user-kyc-admin'
import { CreateUserKycAdminDecisionDto } from '@lib/user-kyc-admin/dto/create-user-kyc-admin-decision.dto'
import { UserKycCynopsisService } from '@lib/user-kyc-cynopsis'
import { CreateUserKycHistoryDto } from '@lib/user-kyc/dto/create-user-kyc-history.dto'
import { UpdateUserKycDto } from '@lib/user-kyc/dto/update-user-kyc.dto'
import { UserInfoHistoryDto } from '@lib/user/dto/user-info-history.dto'
import { UserInfoDto } from '@lib/user/dto/user-info.dto'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { UserInfoStatus, UserKycVerifyStatus } from '@lib/user/enum/user.enum'
import {
  BusinessException,
  CynopsisError,
  KycError,
  UserError,
  UserInfoError,
} from '@lib/util'
import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import {
  IRejectKycDto,
  IReviewOcrDto,
  IReviewRiskDto,
  IUpdateUserInfoDto,
  IUserInfoHistoryFilterDto,
} from './admin-aggregate.interface'

@Injectable()
export class AdminAggregateService {
  constructor(
    private userService: UserService,
    private userKycService: UserKycService,
    private userKycAdminService: UserKycAdminService,
    private redisQueueService: RedisQueueService,
    private userKycCynopsisService: UserKycCynopsisService,
    private amazonCognitoService: AmazonCognitoService,
    private artemisService: ArtemisService,
    private userInfoHistoryService: UserInfoHistoryService,
    private userInfoService: UserInfoService,
    private userKycHistoryService: UserKycHistoryService,
    private uploadFileService: UploadFileService,
  ) {}

  async reviewOcr(reviewOcrDto: IReviewOcrDto) {
    const user = await this.userService.getUserById(reviewOcrDto.userId)
    if (!user) {
      throw new BusinessException(UserError.NOT_FOUND)
    }

    if (
      reviewOcrDto.status != KycStatus.ACCEPT &&
      reviewOcrDto.status != KycStatus.PENDING_PAPER &&
      reviewOcrDto.status != KycStatus.REJECT
    ) {
      throw new BusinessException(KycError.INVALID_STATUS)
    }

    const userKyc = await this.userKycService.getKycByUserId(
      reviewOcrDto.userId,
    )
    if (!userKyc) {
      throw new BusinessException(KycError.NOT_FOUND)
    }

    if (
      userKyc.status != KycStatus.AUTO_KYC_PROCESSED &&
      userKyc.status != KycStatus.PENDING_PAPER
    ) {
      throw new BusinessException(KycError.INVALID_STATUS)
    }

    if (reviewOcrDto.status == KycStatus.ACCEPT) {
      const duplicateKyc = await this.userKycService.checkDuplicateIdDocumentNo(
        reviewOcrDto.idDocumentNo,
        userKyc.idDocumentType,
        userKyc.countryId,
        reviewOcrDto.userId,
      )

      if (duplicateKyc) {
        throw new BusinessException(KycError.DUPLICATE_ID_DOCUMENT_NO)
      }
    }

    const createUserKycAdminDecisionDto = plainToClass(
      CreateUserKycAdminDecisionDto,
      {
        ...reviewOcrDto,
        userKycHistoryId: userKyc.userKycHistoryId,
      },
      {
        excludeExtraneousValues: true,
      },
    )
    createUserKycAdminDecisionDto.rejectionReasons =
      reviewOcrDto.status == KycStatus.REJECT
        ? reviewOcrDto.rejectionReasons
        : null

    await this.userKycAdminService.saveAdminDecision(
      createUserKycAdminDecisionDto,
    )

    const updateUserKycDto = plainToClass(UpdateUserKycDto, reviewOcrDto, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })

    await this.userKycService.updateUserKyc(userKyc.id, updateUserKycDto)

    if (reviewOcrDto.status == KycStatus.REJECT) {
      await this.userService.updateKycVerifyStatus(
        reviewOcrDto.userId,
        UserKycVerifyStatus.REJECTED,
      )
    } else if (reviewOcrDto.status == KycStatus.ACCEPT) {
      // this.redisQueueService.addKycDocumentApprovedJob({
      //   userKycHistoryId: userKyc.userKycHistoryId,
      // })
      await this.userService.updateKycVerifyStatus(
        reviewOcrDto.userId,
        UserKycVerifyStatus.VERIFIED,
      )
      await this.userService.updateLv(reviewOcrDto.userId, 4)
    }
  }

  async reviewRisk(reviewRiskDto: IReviewRiskDto) {
    const user = await this.userService.getUserById(reviewRiskDto.userId)
    if (!user) {
      throw new BusinessException(UserError.NOT_FOUND)
    }

    const userKyc = await this.userKycService.getKycByUserId(
      reviewRiskDto.userId,
    )
    if (!userKyc) {
      throw new BusinessException(KycError.NOT_FOUND)
    }

    if (
      userKyc.status != KycStatus.APPROVED_PAPER &&
      userKyc.status != KycStatus.PENDING
    ) {
      throw new BusinessException(KycError.INVALID_STATUS)
    }

    const createUserKycAdminDecisionDto = plainToClass(
      CreateUserKycAdminDecisionDto,
      {
        ...userKyc,
        riskRating: reviewRiskDto.riskRating,
        status: reviewRiskDto.status,
        adminId: reviewRiskDto.adminId,
      },
      {
        excludeExtraneousValues: true,
      },
    )
    createUserKycAdminDecisionDto.rejectionReasons =
      reviewRiskDto.status == KycStatus.REJECT
        ? reviewRiskDto.rejectionReasons
        : null

    await this.userKycAdminService.saveAdminDecision(
      createUserKycAdminDecisionDto,
    )

    const updateUserKycDto = plainToClass(UpdateUserKycDto, reviewRiskDto, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })

    await this.userKycService.updateUserKyc(userKyc.id, updateUserKycDto)

    if (reviewRiskDto.status == KycStatus.REJECT) {
      await this.userService.updateKycVerifyStatus(
        reviewRiskDto.userId,
        UserKycVerifyStatus.REJECTED,
      )
    } else if (reviewRiskDto.status == KycStatus.ACCEPT) {
      await this.userService.updateKycVerifyStatus(
        reviewRiskDto.userId,
        UserKycVerifyStatus.VERIFIED,
      )
      await this.userService.updateLv(reviewRiskDto.userId, 4)
    }
  }

  async renewCynopsisData(userKycHistoryId: string) {
    const result = {
      success: false,
      message: '',
    }
    const userKycCynopsis =
      await this.userKycCynopsisService.getCynopsisByHistoryId(userKycHistoryId)
    if (!userKycCynopsis) {
      result.message = CynopsisError.NOT_FOUND.message
      return result
    }
    const token = await this.amazonCognitoService.getAccessToken()
    if (!userKycCynopsis.hasCynopsisData) {
      result.message = CynopsisError.FAIL_TO_GET_DATA.message
      return result
    }
    await this.artemisService.scanCynopsisData(
      userKycCynopsis.recordId,
      userKycCynopsis.customerId,
      token,
    )
    const cynopsisData = await this.artemisService.getAllCynopsisData(
      userKycCynopsis,
      token,
    )
    if (!cynopsisData) {
      result.message = CynopsisError.FAIL_TO_GET_DATA.message
      return result
    }
    await this.userKycCynopsisService.updateCynopsis(userKycCynopsis.id, {
      cynopsisData: cynopsisData,
    })
    result.success = true
    return result
  }

  async updateUserInfo(updateUserInfoDto: IUpdateUserInfoDto) {
    const { userId, idDocumentNo } = updateUserInfoDto
    const user = await this.userService.getUserById(userId)
    if (user.userInfoStatus != UserInfoStatus.UPDATED) {
      throw new BusinessException(UserInfoError.INFO_NOT_FOUND)
    }

    const userKyc = await this.userKycService.getKycByUserId(userId)

    if (userKyc && idDocumentNo) {
      const isDuplicate = await this.userKycService.checkDuplicateIdDocumentNo(
        idDocumentNo,
        userKyc.idDocumentType,
        updateUserInfoDto.countryId,
        userId,
      )
      if (isDuplicate) {
        throw new BusinessException(KycError.DUPLICATE_ID_DOCUMENT_NO)
      }
    }

    const existingInfo = await this.userInfoService.getInfoByUserId(userId)

    const baseInfoDto = {
      ...updateUserInfoDto,
    }

    const userInfoHistoryDto = plainToClass(
      UserInfoHistoryDto,
      { ...baseInfoDto, isModifiedByUser: false },
      {
        excludeExtraneousValues: true,
      },
    )
    const userInfoHistory =
      await this.userInfoHistoryService.saveUserInfoHistory(userInfoHistoryDto)

    const userInfoDto = plainToClass(UserInfoDto, baseInfoDto, {
      excludeExtraneousValues: true,
    })
    userInfoDto.userInfoHistoryId = userInfoHistory.id
    userInfoDto.id = existingInfo.id
    await this.userInfoService.saveUserInfo(userInfoDto)

    this.redisQueueService.addUserChangeInfoJob({ userId: user.id })

    if (!userKyc || !idDocumentNo) return

    const userKycHistory = await this.userKycHistoryService.getById(
      userKyc.userKycHistoryId,
    )

    const newHistoryDto = plainToClass(CreateUserKycHistoryDto, {
      ...userKycHistory,
      isModifiedByUser: false,
      idDocumentNo: idDocumentNo,
      remark: updateUserInfoDto.remark,
    })

    const newHistory = await this.userKycHistoryService.saveUserKycHistory(
      newHistoryDto,
    )

    await this.userKycService.updateUserKyc(userKyc.id, {
      userKycHistoryId: newHistory.id,
      idDocumentNo: updateUserInfoDto.idDocumentNo,
      remark: updateUserInfoDto.remark,
    })
  }

  async getListUserInfoHistory(
    userInfoHistoryFilterDto: IUserInfoHistoryFilterDto,
  ) {
    const userInfoHistories =
      await this.userInfoHistoryService.getInfoHistoriesByUserId(
        userInfoHistoryFilterDto.userId,
      )

    const kycHistories = await this.userKycHistoryService.getListUserKycHistory(
      userInfoHistoryFilterDto.userId,
    )

    for (let i = 0; i < kycHistories.length; i++) {
      const kycHistory = kycHistories[i]
      for (let j = 0; j < kycHistory.files.length; j++) {
        const file = kycHistory.files[j]
        file['path'] = await this.uploadFileService.getPublicUrl(file['name'])
      }
    }
    userInfoHistories.forEach((infoHistory) => {
      infoHistory.userKycHistory = kycHistories.find(
        (e) => e.userInfoHistoryId == infoHistory.id,
      )
    })
    return userInfoHistories
  }

  async rejectKyc(rejectKycDto: IRejectKycDto) {
    const user = await this.userService.getUserById(rejectKycDto.userId)
    if (!user) {
      throw new BusinessException(UserError.NOT_FOUND)
    }

    const userKyc = await this.userKycService.getKycByUserId(
      rejectKycDto.userId,
    )
    if (!userKyc) {
      throw new BusinessException(KycError.NOT_FOUND)
    }

    if (
      userKyc.status != KycStatus.AUTO_KYC_PROCESSED &&
      userKyc.status != KycStatus.PENDING_PAPER &&
      userKyc.status != KycStatus.APPROVED_PAPER &&
      userKyc.status != KycStatus.PENDING
    ) {
      throw new BusinessException(KycError.INVALID_STATUS)
    }

    const createUserKycAdminDecisionDto = plainToClass(
      CreateUserKycAdminDecisionDto,
      {
        ...rejectKycDto,
        status: KycStatus.REJECT,
        userKycHistoryId: userKyc.userKycHistoryId,
      },
      {
        excludeExtraneousValues: true,
      },
    )

    await this.userKycAdminService.saveAdminDecision(
      createUserKycAdminDecisionDto,
    )

    const updateUserKycDto: UpdateUserKycDto = {
      status: KycStatus.REJECT,
      rejectionReasons: rejectKycDto.rejectionReasons,
    }

    await this.userKycService.updateUserKyc(userKyc.id, updateUserKycDto)

    await this.userService.updateKycVerifyStatus(
      rejectKycDto.userId,
      UserKycVerifyStatus.REJECTED,
    )
  }
}
