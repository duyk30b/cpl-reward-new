import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiParam, ApiQuery } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { AdminLoginHistoryFilterDto } from './dto/admin-login-history-filter.dto'
import { ChangeEmailDto } from './dto/change-email.dto'
import { CheckDuplicateIdDocumentNoDto } from './dto/check-duplicate-id-document-no.dto'
import { CheckEmailExistDto } from './dto/check-email-exist.dto'
import { ListDividendUserDto } from './dto/list-dividend-user.dto'
import { SearchUserDto } from './dto/search-user.dto'
import { UpdateUserInfoDto } from './dto/update-user-info.dto'
import {
  CountReferralFilterDto,
  CountUserSameIpDto,
  UserFilterDto,
} from './dto/user-filter.dto'
import { UserKycAdminDecisionFilterDto } from './dto/user-kyc-admin-decision-filter.dto'
import { UserKycFilterDto } from './dto/user-kyc-filter.dto'
import { UserKycHistoryFilterDto } from './dto/user-kyc-history-filter.dto'

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/user')
  async getListUserForManagement(@Query() userFilterDto: UserFilterDto) {
    return await this.adminService.getListUserForManagement(userFilterDto)
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/user/:id')
  async getUser(@Param('id') userId: string) {
    return await this.adminService.getUser(userId)
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/user/:id/referral-count')
  async countUserReferral(
    @Param('id') userId: string,
    @Query() filter: CountReferralFilterDto,
  ) {
    return await this.adminService.countUserReferral(userId, filter)
  }

  @Get('/personal-kyc')
  async getListPersonalKyc(@Query() userKycFilterDto: UserKycFilterDto) {
    return await this.adminService.getListPersonalKyc(userKycFilterDto)
  }

  @Get('/enterprise-kyc')
  async getListEnterpriseKyc(@Query() userKycFilterDto: UserKycFilterDto) {
    return await this.adminService.getListEnterpriseKyc(userKycFilterDto)
  }

  @Post('/check-duplicate-id-document-no')
  async checkDuplicateIdDocumentNo(
    @Body() checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
  ) {
    const exist = await this.adminService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
    )
    return { valid: !exist }
  }

  // @Post('/update-user-info-ocr')
  // async updateUserInfoOcr(@Body() updateUserInfoOcrDto: UpdateUserInfoOcrDto) {
  //   await this.adminService.updateUserInfoOcr(updateUserInfoOcrDto)
  //   return { success: true }
  // }

  // @Post('/conclude-user-kyc')
  // async concludeUserKyc(@Body() concludeUserKycDto: ConcludeUserKycDto) {
  //   await this.adminService.concludeUserKyc(concludeUserKycDto)
  //   return { success: true }
  // }

  @Get('/user-kyc-history')
  async getListUserKycHistory(
    @Query() userKycHistoryFilterDto: UserKycHistoryFilterDto,
  ) {
    return await this.adminService.getListUserKycHistory(
      userKycHistoryFilterDto,
    )
  }

  @Get('/user-kyc-admin-decision')
  async getListUserKycAdminDecision(
    @Query() userKycAdminDecisionFilterDto: UserKycAdminDecisionFilterDto,
  ) {
    return await this.adminService.getListUserKycAdminDecision(
      userKycAdminDecisionFilterDto,
    )
  }

  @ApiQuery({ name: 'user_id', required: true })
  @Get('/user-kyc-detail')
  async getUserKycDetail(@Query('user_id') userId: string) {
    return await this.adminService.getUserKycDetail(userId)
  }

  @ApiQuery({ name: 'user_id', required: true })
  @Get('/enterprise-info-detail')
  async getEnterpriseInfo(@Query('user_id') userId: string) {
    return await this.adminService.getEnterpriseInfo(userId)
  }

  @ApiQuery({ name: 'user_id', required: true })
  @Get('/user-info-detail')
  async getUserInfo(@Query('user_id') userId: string) {
    return await this.adminService.getUserInfo(userId)
  }

  @ApiQuery({ name: 'type', required: true })
  @ApiQuery({ name: 'history_id', required: true })
  @Get('/artemis-search-result')
  async getSearchResult(
    @Query('type') type: string,
    @Query('history_id') historyId: string,
  ) {
    return await this.adminService.getSearchResult(type, historyId)
  }

  @ApiQuery({ name: 'history_id', required: true })
  @Get('/artemis-internet-search-result')
  async getInternetSearchResult(@Query('history_id') historyId: string) {
    return await this.adminService.getInternetSearchResult(historyId)
  }

  @ApiQuery({ name: 'history_id', required: true })
  @Get('/artemis-risk-report')
  async getRiskReportResult(@Query('history_id') historyId: string) {
    return await this.adminService.getRiskReportResult(historyId)
  }

  // @ApiQuery({ name: 'history_id', required: true })
  // @Post('/renew-cynopsis-data')
  // async renewCynopsisData(@Query('history_id') historyId: string) {
  //   return await this.adminService.renewCynopsisData(historyId)
  // }

  @ApiQuery({ name: 'user_id', required: true })
  @Get('/user-remove-authenticator')
  async userRemoveAuthenticator(@Query('user_id') userId: string) {
    return await this.adminService.userRemoveAuthenticator(userId)
  }

  @ApiQuery({ name: 'user_id', required: true })
  @Post('/user/toggle-ban')
  async toggleBanUser(@Query('user_id') userId: string) {
    return await this.adminService.toggleBanUser(userId)
  }

  @Post('/update-user-info')
  async updateUserInfo(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    await this.adminService.updateUserInfo(updateUserInfoDto)
    return { success: true }
  }

  /**
   *  TODO: this api was deprecated
   * @param loginHistoryFilterDto
   */
  @Get('/login-history')
  async getListLoginHistory(
    @Query() loginHistoryFilterDto: AdminLoginHistoryFilterDto,
  ) {
    return await this.adminService.getListLoginHistory(loginHistoryFilterDto)
  }

  @Post('/check-email-exist')
  async checkEmailExist(@Body() checkEmailExistDto: CheckEmailExistDto) {
    return await this.adminService.checkEmailExist(checkEmailExistDto)
  }

  @Post('user/:user_id/change-email')
  async changeEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Param('user_id') userId: string,
  ) {
    await this.adminService.changeEmail(userId, changeEmailDto)
    return { success: true }
  }

  @Get('/search')
  async searchUser(@Query() query: SearchUserDto) {
    return await this.adminService.getUsersPaginate(query)
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/user/:id/count-user-same-ip')
  async countUserSameIp(
    @Param('id') userId: string,
    @Query() filter: CountUserSameIpDto,
  ) {
    return await this.adminService.countUserSameIp(userId, filter)
  }

  @Get('/list-dividend-user')
  async listDividendUser(@Query() query: ListDividendUserDto) {
    return await this.adminService.listDividendUser(query)
  }
}
