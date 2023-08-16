import {
  BaseFilterQuery,
  BlacklistUserDto,
  GrpcDepositByIdResponse,
  GrpcGetBlacklistUserResponse,
  GrpcWithdrawByIdResponse,
} from '@lib/grpc-client/hot-wallet/dtos'
import { HotWalletService } from '@lib/grpc-client/hot-wallet/services'
import {
  IUserFilterForHotWallet,
  UserErrorMessage,
  UserService,
} from '@lib/grpc-client/user'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { AdminService } from '@lib/admin'
import { uniq, flattenDepth } from 'lodash'
import { CreateBceManualDepositDto } from '@lib/grpc-client/wallet-bce-backend/dtos/wallet-bce-backend.dto'
import { WalletBceBackendService } from '@lib/grpc-client/wallet-bce-backend/services'
@Injectable()
export class ApiHotWalletService {
  protected readonly logger = new Logger(ApiHotWalletService.name)
  constructor(
    private readonly userService: UserService,
    private readonly hotWalletService: HotWalletService,
    private readonly adminService: AdminService,

    private readonly walletBceBackendService: WalletBceBackendService,
  ) {}

  async getListBlacklistUser(query: BaseFilterQuery) {
    const { page, size, keyword } = query

    /**
     * * For case has keyword. Means this need to filter by email in user auth repo
     * * => Need to mapping data from both table user (auth) and blacklist user (hot wallet)
     * * This is TEMPORARY SOLUTION. Will refactor later
     * ! Risk: Not good at performance
     * ? Waiting for solution based on Elastic Search from Mr Trung
     */

    const filter: BaseFilterQuery = {
      page,
      size,
    }

    if (keyword) {
      filter.size = 0 //* 0 Means unlimited
    }

    const listBlacklistUser = await this.hotWalletService.getListBlacklistUser(
      filter,
    )

    const userIds: number[] = []

    const listBlacklistUserObj: Record<string, BlacklistUserDto> = {}

    listBlacklistUser.data?.forEach((item) => {
      const { userId } = item

      userIds.push(Number(userId))

      listBlacklistUserObj[userId] = item
    })

    if (!userIds.length) {
      return plainToInstance(GrpcGetBlacklistUserResponse, {
        data: [],
        message: listBlacklistUser.message,
        timeStamp: listBlacklistUser.timeStamp,
        totalCount: 0,
      })
    }

    // if searching, pagination follow list user of auth service
    const userFilterForHotWallet: IUserFilterForHotWallet = {
      page: keyword ? page : 1,
      perPage: size,
      keyword,
      userIds,
    }

    const listUsers = await this.userService.getListUserForHotWallet(
      userFilterForHotWallet,
    )

    const lisBlacklistUserMapped = listUsers.data.map((item) => {
      const blacklistUserData = (listBlacklistUserObj[item.userId] ||
        {}) as BlacklistUserDto

      blacklistUserData.email = item.email

      return blacklistUserData
    })

    return plainToInstance(GrpcGetBlacklistUserResponse, {
      data: lisBlacklistUserMapped.sort((a, b) => b.id - a.id),
      message: listBlacklistUser.message,
      timeStamp: listBlacklistUser.timeStamp,
      totalCount: keyword
        ? listUsers.pagination.total
        : instanceToPlain(listBlacklistUser)?.total_count,
    })
  }

  async searchListBlacklistUserEmail(query: BaseFilterQuery) {
    const { page, size, keyword } = query

    const filter: BaseFilterQuery = {
      page,
      size,
    }

    if (keyword) {
      filter.size = 0 //* 0 Means unlimited
    }

    const listBlacklistUser = await this.hotWalletService.getListBlacklistUser(
      filter,
    )

    const userIds: number[] = []

    listBlacklistUser.data?.forEach((item) => {
      const { userId } = item

      userIds.push(Number(userId))
    })

    const userFilterForHotWallet: IUserFilterForHotWallet = {
      page,
      perPage: size,
      keyword,
      notUserIds: userIds,
    }

    const listUsers = await this.userService.getListUserForHotWallet(
      userFilterForHotWallet,
    )

    return listUsers
  }

  async getWithdrawById(id) {
    const data = await this.hotWalletService.getWithdrawById(id)
    return this.addAdminInfoToTransactionLog(data)
  }

  async getDepositById(id) {
    const data = await this.hotWalletService.getDepositById(id)
    return this.addAdminInfoToTransactionLog(data)
  }

  async addAdminInfoToTransactionLog(
    data: GrpcWithdrawByIdResponse | GrpcDepositByIdResponse,
  ): Promise<GrpcWithdrawByIdResponse | GrpcDepositByIdResponse> {
    if (!data.data.logs || !data.data.logs.length) {
      return data
    }

    const adminIds = flattenDepth(
      data.data.logs.map((log) => [log.createdBy, log.overwriteActionBy]),
      1,
    )
    const admins = await this.adminService.getAdminByIds(uniq(adminIds))

    data.data.logs = data.data.logs.map((log) => {
      if (log.createdBy) {
        const createdAdmin = admins.find((admin) => +admin.id === log.createdBy)
        log.createdAdmin = createdAdmin
      }

      if (log.overwriteActionBy) {
        const overwriteAdmin = admins.find(
          (admin) => +admin.id === log.overwriteActionBy,
        )
        log.overwriteAdmin = overwriteAdmin
      }

      return log
    })

    return data
  }

  async createBceManualDeposit(body: CreateBceManualDepositDto) {
    const { userId } = body
    const user = await this.userService.findById(userId)
    if (Object.keys(user).length === 0) {
      throw new BadRequestException(UserErrorMessage.USER_NOT_FOUND)
    }
    return this.walletBceBackendService.createBceManualDeposit(body)
  }
}
