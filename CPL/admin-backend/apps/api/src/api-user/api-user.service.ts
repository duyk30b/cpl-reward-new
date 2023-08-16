import {
  ExportType,
  IBanUser,
  IListUserBlacklistHistoryResponse,
  IUserBlacklistHistoryFilter,
  UserService,
} from '@lib/grpc-client/user'
import { Injectable, Logger } from '@nestjs/common'
import {
  UserBanHistoryFilterDto,
  UserFilterDto,
  UserFilterMarketingDto,
  UserSearchDto,
} from './api-user.dto'
import { ExternalBceService } from '@lib/external-bce'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { BanUserHistoryService } from '@lib/ban-user-history'
import { UploadFileService } from '@lib/upload-file'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { BanUserEvent } from './api-user.event'
import { UpdateBanHistoryDto } from '@lib/ban-user-history/ban-user-history.dto'
import { getClientIp } from 'request-ip'
import { BusinessException, UploadFileError } from '@lib/util'
import { RejectKycReasonArray, UserKycService } from '@lib/grpc-client/user-kyc'
import { IRequestLogInfo } from '@lib/external-bce/external-bce.interface'
import { ExchangeOrderService } from '@lib/grpc-client/exchange/services/exchange-order.service'

@Injectable()
export class ApiUserService {
  protected readonly logger = new Logger(ApiUserService.name)
  constructor(
    private readonly userService: UserService,
    private readonly externalBceService: ExternalBceService,
    private readonly banUserHistoryService: BanUserHistoryService,
    private readonly uploadFileService: UploadFileService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userKycService: UserKycService,
    private readonly exchangeOrderService: ExchangeOrderService,
  ) {}

  async rejectKycUser(userId: string, adminId: string) {
    const rejectKycResult = await this.userKycService.rejectKyc({
      userId,
      rejectionReasons: RejectKycReasonArray,
      adminId,
    })
    this.logger.log(
      `[banUser-rejectKyc] userId: ${userId}, response: ${JSON.stringify(
        rejectKycResult,
      )}`,
    )
    return rejectKycResult
  }

  async cancelWithdrawWhenBan(userId: string, requestLogInfo: IRequestLogInfo) {
    const cancelWithdrawResult = await this.externalBceService.cancelWithdraw(
      userId,
      requestLogInfo,
    )
    this.logger.log(
      `[banUser-cancelWithdraw] userId: ${userId}, response: ${JSON.stringify(
        cancelWithdrawResult.response,
      )}`,
    )
    return cancelWithdrawResult
  }

  async cancelOrderWhenBan(userId: string, cancellerId: string) {
    const cancelOrderResult =
      await this.exchangeOrderService.cancelOrderByUserId({
        userId,
        cancellerId,
      })
    this.logger.log(
      `[banUser-cancelOrder] userId: ${userId}, response: ${JSON.stringify(
        cancelOrderResult,
      )}`,
    )
    return cancelOrderResult
  }

  async unbanUser(userId: string) {
    return await this.userService.unbanUser(userId)
  }

  async banUser(userId: string, data?: IBanUser) {
    return await this.userService.banUser(userId, data)
  }

  async getUserBlacklistHistory(
    blacklistHistoryFilter: IUserBlacklistHistoryFilter,
  ): Promise<IListUserBlacklistHistoryResponse> {
    return await this.userService.getUserBlacklistHistory(
      blacklistHistoryFilter,
    )
  }

  async getListUserForManagement(userFilterDto: UserFilterDto) {
    return await this.userService.getListUserForManagement(userFilterDto)
  }

  async getListUserForMarketing(
    userFilterMarketingDto: UserFilterMarketingDto,
  ) {
    return await this.userService.getListUserForMarketing(
      userFilterMarketingDto,
    )
  }

  async getUser(userId: string) {
    return await this.userService.findById(userId)
  }

  async getUsersExportInfo() {
    return await this.userService.getUsersExport({
      type: ExportType.ExportUserBasicInfoType,
    })
  }

  async createUsersExport(userFilterDto: UserFilterDto) {
    return await this.userService.createUsersExport(userFilterDto)
  }

  async getUserMarketingExport() {
    return await this.userService.getUsersExport({
      type: ExportType.ExportUserTagType,
    })
  }

  async createUserMarketingExport(userFilterDto: UserFilterMarketingDto) {
    return await this.userService.createUserMarketingExport(userFilterDto)
  }

  async getListBanHistory(banHistoryFilterDto: UserBanHistoryFilterDto) {
    return await this.banUserHistoryService.getListBanHistory(
      banHistoryFilterDto,
    )
  }

  static checkOver10kRows(content: string) {
    const rows = content
      .slice(0)
      .split('\n')
      .filter((row) => row !== '')
    return rows.length <= 10000
  }

  async uploadBanUsersFile(
    file: Express.Multer.File,
    request: IRequestWithAccessToken,
  ) {
    if (file.mimetype !== 'text/csv') {
      throw new BusinessException(UploadFileError.WRONG_FILE_TYPE)
    }
    if (file.size === 0) {
      throw new BusinessException(UploadFileError.BLANK_FILE)
    }
    if (file.size > 1000000) {
      throw new BusinessException(UploadFileError.OVER_1MB)
    }
    const checkRows = ApiUserService.checkOver10kRows(file.buffer.toString())
    if (!checkRows) {
      throw new BusinessException(UploadFileError.OVER_ROWS)
    }
    const requestTime = `${Date.now()}`
    const ip = getClientIp(request)
    const otherData = {
      ip,
      adminId: request.accessTokenInfo ? request.accessTokenInfo.uid : '0',
      userAgent: request.headers['user-agent'],
    }
    const uploaded = await this.uploadFileService.upload(
      file,
      'import_ban_users',
      otherData,
    )
    if (uploaded.name === undefined) return uploaded

    this.eventEmitter.emit(BanUserEvent.CREATED, {
      ...uploaded,
      requestTime,
      request,
    })
    return uploaded
  }

  async getBanUserHistoryById(id: string) {
    return await this.banUserHistoryService.findOne({ id })
  }

  async updateBanUserHistory(updateBanHistory: UpdateBanHistoryDto) {
    return await this.banUserHistoryService.update(updateBanHistory)
  }

  async searchByFilter(query: UserSearchDto) {
    return this.userService.searchByFilter(query)
  }

  async resetAuthenticator(userId: string) {
    return await this.userService.resetAuthenticator(userId)
  }

  async changeEmail(userId: string, newEmail: string) {
    return await this.userService.changeEmail(userId, newEmail)
  }
}
