import { AdminAggregateService } from '@lib/admin-aggregate'
import { AmazonCognitoService } from '@lib/amazon-cognito'
import { ArtemisService } from '@lib/artemis'
import { BlacklistUserService } from '@lib/blacklist'
import { LoginHistoryService } from '@lib/login-history'
import { UploadFileService } from '@lib/upload-file'
import {
  EnterpriseInfoService,
  NewAdminUserService,
  OldAdminUserService,
  UserInfoHistoryService,
  UserInfoService,
  UserService,
} from '@lib/user'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import { UserKycAdminService } from '@lib/user-kyc-admin'
import { UserKycCynopsisService } from '@lib/user-kyc-cynopsis'
import { INewAdminUserForManagementFilter } from '@lib/user/interfaces/user.interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import parsePhoneNumberFromString from 'libphonenumber-js'
import { AdminLoginHistoryFilterDto } from './dto/admin-login-history-filter.dto'
import { ChangeEmailDto } from './dto/change-email.dto'
import { CheckDuplicateIdDocumentNoDto } from './dto/check-duplicate-id-document-no.dto'
import { CheckEmailExistDto } from './dto/check-email-exist.dto'
import { ListDividendUserDto } from './dto/list-dividend-user.dto'
import { UpdateUserInfoDto } from './dto/update-user-info.dto'
import {
  CountReferralFilterDto,
  CountUserSameIpDto,
  UserFilterDto,
} from './dto/user-filter.dto'
import { UserKycAdminDecisionFilterDto } from './dto/user-kyc-admin-decision-filter.dto'
import { UserKycFilterDto } from './dto/user-kyc-filter.dto'
import { UserKycHistoryFilterDto } from './dto/user-kyc-history-filter.dto'

@Injectable()
export class AdminService {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly userService: UserService,
    private readonly oldAdminUserService: OldAdminUserService,
    private readonly userKycAdminService: UserKycAdminService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly userInfoService: UserInfoService,
    private readonly userInfoHistoryService: UserInfoHistoryService,
    private readonly uploadFileService: UploadFileService,
    private readonly enterpriseInfoService: EnterpriseInfoService,
    private readonly userKycCynopsisService: UserKycCynopsisService,
    private readonly amazonCognitoService: AmazonCognitoService,
    private readonly artemisService: ArtemisService,
    private readonly blacklistUserService: BlacklistUserService,
    private readonly loginHistoryService: LoginHistoryService,
    private readonly adminAggregateService: AdminAggregateService,
    private readonly newAdminUserService: NewAdminUserService,
  ) {}

  async getListUserForManagement(userFilterDto: UserFilterDto) {
    return await this.oldAdminUserService.getListUserForManagement(
      userFilterDto,
    )
  }

  async getUser(userId: string) {
    return await this.userService.getUserById(userId)
  }

  async getListPersonalKyc(userKycFilterDto: UserKycFilterDto) {
    return await this.userKycService.getListPersonalKyc(userKycFilterDto)
  }

  async getListEnterpriseKyc(userKycFilterDto: UserKycFilterDto) {
    return await this.userKycService.getListEnterpriseKyc(userKycFilterDto)
  }

  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
  ) {
    return await this.userKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto.idDocumentNo,
      checkDuplicateIdDocumentNoDto.idDocumentType,
      checkDuplicateIdDocumentNoDto.countryId,
      checkDuplicateIdDocumentNoDto.exceptUserId,
    )
  }

  // async updateUserInfoOcr(updateUserInfoOcrDto: UpdateUserInfoOcrDto) {
  //   return this.adminAggregateService.reviewOcr(updateUserInfoOcrDto)
  // }

  // async concludeUserKyc(concludeUserKycDto: ConcludeUserKycDto) {
  //   return this.adminAggregateService.reviewRisk(concludeUserKycDto)
  // }

  async getListUserKycHistory(
    userKycHistoryFilterDto: UserKycHistoryFilterDto,
  ) {
    const kycHistories = await this.userKycHistoryService.getListUserKycHistory(
      userKycHistoryFilterDto.userId,
    )

    const userInfoHistoryIds = kycHistories.map((e) => e.userInfoHistoryId)

    const userInfoHistories =
      await this.userInfoHistoryService.getListUserInfoHistory(
        userInfoHistoryIds,
      )

    for (let i = 0; i < kycHistories.length; i++) {
      const kycHistory = kycHistories[i]
      for (let j = 0; j < kycHistory.files.length; j++) {
        const file = kycHistory.files[j]
        file['path'] = await this.uploadFileService.getPublicUrl(file['name'])
      }
      kycHistory['user_info_history'] = userInfoHistories.find(
        (userInfoHistory) => userInfoHistory.id == kycHistory.userInfoHistoryId,
      )
    }

    return kycHistories
  }

  async getListUserKycAdminDecision(
    userKycAdminDecisionFilterDto: UserKycAdminDecisionFilterDto,
  ) {
    return await this.userKycAdminService.getListUserKycAdminDecision(
      userKycAdminDecisionFilterDto.userId,
    )
  }

  async getUserKycDetail(userId: string) {
    const userKyc = await this.userKycService.getKycByUserId(userId)
    if (!userKyc) {
      throw new BadRequestException('User kyc does not exist')
    }
    for (let i = 0; i < userKyc.files.length; i++) {
      const file = userKyc.files[i]
      file['path'] = await this.uploadFileService.getPublicUrl(file['name'])
    }
    const cynopsis = await this.userKycCynopsisService.getCynopsisByHistoryId(
      userKyc.userKycHistoryId,
    )
    return {
      user_kyc: userKyc,
      cynopsis: cynopsis,
    }
  }

  async getEnterpriseInfo(userId: string) {
    const enterpriseInfo =
      await this.enterpriseInfoService.getEnterpriseInfoByUserId(userId)
    return {
      enterprise_info: enterpriseInfo,
    }
  }

  async getUserInfo(userId: string) {
    const user = classToPlain(await this.userService.getUserById(userId))
    user.is_banned = await this.blacklistUserService.checkUserBlacklisted(
      userId,
    )
    const userInfo = await this.userInfoService.getInfoByUserId(userId)

    // Temporary fix for old admin
    if (userInfo) {
      userInfo['tel'] = userInfo.getPhoneNumber()
      const phoneObject = parsePhoneNumberFromString(userInfo['tel'])
      if (phoneObject) {
        userInfo['region_code'] = phoneObject.country
      }
    }

    return {
      user: user,
      user_info: userInfo,
    }
  }

  async getSearchResult(type: string, historyId: string) {
    const userKycCynopsis =
      await this.userKycCynopsisService.getCynopsisByHistoryId(historyId)
    if (!userKycCynopsis) {
      return null
    }
    return userKycCynopsis.cynopsisData[type]
  }

  async getInternetSearchResult(historyId: string) {
    const userKycCynopsis =
      await this.userKycCynopsisService.getCynopsisByHistoryId(historyId)
    if (!userKycCynopsis) {
      return null
    }
    return userKycCynopsis.cynopsisData['internetSearch']
  }

  async getRiskReportResult(historyId: string) {
    const userKycCynopsis =
      await this.userKycCynopsisService.getCynopsisByHistoryId(historyId)
    if (!userKycCynopsis) {
      return null
    }
    return userKycCynopsis.cynopsisData['riskReport']
  }

  async renewCynopsisData(userKycHistoryId: string) {
    return this.adminAggregateService.renewCynopsisData(userKycHistoryId)
  }

  async userRemoveAuthenticator(userId: string) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      return null
    }
    await this.userService.disableAuthenticator(user)
    return true
  }

  async toggleBanUser(userId: string) {
    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new BadRequestException('User does not exist')
    }
    const isBanned = await this.blacklistUserService.checkUserBlacklisted(
      userId,
    )
    if (isBanned) {
      await this.blacklistUserService.unbanUser(userId)
      return { is_banned: false }
    } else {
      await this.blacklistUserService.banUser(userId)
      await this.userService.logoutAllDevices(userId)
      return { is_banned: true }
    }
  }

  async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto) {
    await this.adminAggregateService.updateUserInfo(updateUserInfoDto)
  }

  /**
   * TODO: this function was deprecated
   * @param loginHistoryFilterDto
   */
  async getListLoginHistory(loginHistoryFilterDto: AdminLoginHistoryFilterDto) {
    return await this.loginHistoryService.getListHistoryForAdminOld(
      loginHistoryFilterDto,
    )
  }

  async checkEmailExist(checkEmailExistDto: CheckEmailExistDto) {
    const result = await this.userService.checkEmailExist(
      checkEmailExistDto.email,
      checkEmailExistDto.exceptUserId,
    )
    return {
      exist: result.exist,
    }
  }

  async changeEmail(userId: string, changeEmailDto: ChangeEmailDto) {
    const user = await this.userService.getUserById(userId)
    const existingUserCheck = await this.userService.checkEmailExist(
      changeEmailDto.newEmail,
      userId,
    )
    if (existingUserCheck.exist) {
      throw new BadRequestException('Email have been used!')
    }
    await this.userService.changeEmail(user, changeEmailDto.newEmail, false)
  }

  async getUsersPaginate(userFilter: INewAdminUserForManagementFilter) {
    return await this.newAdminUserService.getListUserForManagement(userFilter)
  }

  async countUserReferral(userId: string, filter: CountReferralFilterDto) {
    const count = await this.userService.countReferralByUserId(userId, filter)
    return { data: { count } }
  }

  async countUserSameIp(userId: string, filter: CountUserSameIpDto) {
    const count = await this.loginHistoryService.countUserSameIP(userId, filter)
    return { data: { count } }
  }

  async listDividendUser(filter: ListDividendUserDto) {
    return await this.userService.listDividendUser({
      where: {
        isBanned: filter.isBanned,
        types: filter.types,
        statuses: filter.statuses,
      },
      take: filter.take,
      page: filter.page,
    })
  }
}
