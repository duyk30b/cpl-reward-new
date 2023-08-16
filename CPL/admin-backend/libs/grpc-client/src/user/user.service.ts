import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import {
  IBanUser,
  IListUserBlacklistHistoryResponse,
  IListUserForMarketingResponse,
  IUserBlacklistHistoryFilter,
  IUserFilter,
  IUserFilterMarketingRequest,
} from '.'
import {
  UserDto,
  UserForManagementDto,
  CreateUsersExportInfoDto,
  UsersExportInfoDto,
  UserForMarketingDto,
  UserForHotWalletDto,
  UserBlacklistHistoryDto,
} from './user.dto'
import {
  IListUserForHotWallet,
  IListUserForManagement,
  IUserCreateBot,
  IUserFilterForManagement,
  IUserFilterForHotWallet,
  IUserService,
  IUsersExportType,
} from './user.interface'
import { PostResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { STATUS, STATUS_NOTE } from '@lib/ban-user-history'
import { EmailChangeHistoryDto } from '@lib/grpc-client/email-change-history/email-change-history.dto'

@Injectable()
export class UserService {
  protected readonly logger = new Logger(UserService.name)
  private userService: IUserService
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserService>('UserService')
  }

  async unbanUser(userId: string): Promise<PostResponseDto> {
    const req = this.userService.unbanUser({ id: userId })
    const result = await lastValueFrom(req)
    return plainToInstance(PostResponseDto, result, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
  }

  async banUser(userId: string, data: IBanUser): Promise<PostResponseDto> {
    const req = this.userService.banUser({ id: userId, note: '', ...data })
    const result = await lastValueFrom(req)
    return plainToInstance(PostResponseDto, result, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
  }

  async getUserBlacklistHistory(
    blacklistHistoryFilter: IUserBlacklistHistoryFilter,
  ): Promise<IListUserBlacklistHistoryResponse> {
    const req = await this.userService.getUserBlacklistHistory(
      blacklistHistoryFilter,
    )
    const result = await lastValueFrom(req)
    result.data = (result.data || []).map((item) =>
      plainToInstance(UserBlacklistHistoryDto, item, {
        ignoreDecorators: true,
      }),
    )
    return result
  }

  async findById(userId: string): Promise<UserDto> {
    const req = this.userService.findOne({ id: userId })
    const user = await lastValueFrom(req)
    return plainToInstance(UserDto, user, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
  }

  async findByIds(userIds: string[]): Promise<UserDto[]> {
    this.logger.debug('gRPC: UserService@findByIds')
    const req = this.userService.findByIds({ ids: userIds })
    const data = await lastValueFrom(req)
    return (data.data || []).map((item) =>
      plainToInstance(UserDto, item, { ignoreDecorators: true }),
    )
  }

  async findByEmails(findByEmails: string[]): Promise<UserDto[]> {
    this.logger.debug('gRPC: UserService@findByEmails')
    const req = this.userService.findByEmails({ emails: findByEmails })
    const data = await lastValueFrom(req)

    return (data.data || []).map((item) =>
      plainToInstance(UserDto, item, { ignoreDecorators: true }),
    )
  }

  async getListUserForManagement(
    userFilterForManagement: IUserFilterForManagement,
  ): Promise<IListUserForManagement> {
    const req = this.userService.getListUserForManagement(
      userFilterForManagement,
    )
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(UserForManagementDto, item, { ignoreDecorators: true }),
    )
    return data
  }

  async getListUserForMarketing(
    userFilterMarketingRequest: IUserFilterMarketingRequest,
  ): Promise<IListUserForMarketingResponse> {
    const req = this.userService.getListUserForMarketing(
      userFilterMarketingRequest,
    )
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(UserForMarketingDto, item, { ignoreDecorators: true }),
    )
    return data
  }

  async getUsersExport(type: IUsersExportType): Promise<UsersExportInfoDto> {
    const req = this.userService.getUsersExport(type)
    const res = await lastValueFrom(req)

    return plainToInstance(UsersExportInfoDto, res, { ignoreDecorators: true })
  }

  async createUsersExport(
    userFilterForManagement: IUserFilterForManagement,
  ): Promise<CreateUsersExportInfoDto> {
    const req = this.userService.createUsersExport(userFilterForManagement)
    const res = await lastValueFrom(req)

    return plainToInstance(CreateUsersExportInfoDto, res, {
      ignoreDecorators: true,
    })
  }

  async createUserMarketingExport(
    userFilter: IUserFilterMarketingRequest,
  ): Promise<CreateUsersExportInfoDto> {
    const req = this.userService.createUserMarketingExport(userFilter)
    const res = await lastValueFrom(req)

    return plainToInstance(CreateUsersExportInfoDto, res, {
      ignoreDecorators: true,
    })
  }

  getStatusBanUserHistory(user: UserDto): { status: number; note: string } {
    if (Object.keys(user).length === 0)
      return { status: STATUS.NOT_FOUND, note: STATUS_NOTE.USER_NOT_FOUND }
    if (user.isBanned !== undefined && user.isBanned === 1)
      return {
        status: STATUS.DUPLICATED_BANNED,
        note: STATUS_NOTE.DUPLICATED_BANNED,
      }
    return { status: STATUS.WAITING, note: undefined }
  }

  async getListUserForHotWallet(
    userFilterForHotWallet: IUserFilterForHotWallet,
  ): Promise<IListUserForHotWallet> {
    const req = this.userService.getListUserForHotWallet(userFilterForHotWallet)

    const result = await lastValueFrom(req)
    result.data = (result.data || []).map((item) =>
      plainToInstance(UserForHotWalletDto, item, { ignoreDecorators: true }),
    )

    return result
  }

  async createBotUser(request: IUserCreateBot): Promise<PostResponseDto> {
    const req = this.userService.createBot(request)
    const result = await lastValueFrom(req)
    return plainToInstance(PostResponseDto, result, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
  }

  async searchByFilter(userFilter: IUserFilter): Promise<UserDto[]> {
    const req = this.userService.searchByFilter(userFilter)
    const data = await lastValueFrom(req)
    return (data.data || []).map((item) =>
      plainToInstance(UserDto, item, { ignoreDecorators: true }),
    )
  }

  async resetAuthenticator(userId: string) {
    const req = this.userService.resetAuthenticator({ id: userId })
    return await lastValueFrom(req)
  }

  async changeEmail(userId: string, email: string) {
    const req = this.userService.changeEmail({ userId, email })
    return await lastValueFrom(req)
  }
}
