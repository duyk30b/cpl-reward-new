import { IPostResponse } from '@lib/grpc-client/grpc-client.interface'
import { NewAdminUserService, UserService } from '@lib/user'
import {
  ICreateBotDto,
  IUserFilter,
  IUserFilterForHotWallet,
} from '@lib/user/interfaces/user.interface'
import { IDataById } from '@lib/util/util.interface'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { ResponseString } from '../interfaces/response-string.interface'
import {
  IBanUser,
  IUnbanUser,
  IUserByEmail,
  IUserByEmails,
  IUserByIds,
  IUserFilterForManagement,
  IUserFilterMarketing,
  IValidateOtpDto,
  UserExportTypeInterface,
} from './internal-user.interface'
import { InternalUserService } from './internal-user.service'

@Controller('User')
export class InternalUserController {
  constructor(
    private readonly userService: UserService,
    private readonly newAdminUserService: NewAdminUserService,
    private readonly internalUserService: InternalUserService,
  ) {}

  @GrpcMethod('UserService')
  async findOne(userById: IDataById) {
    return await this.internalUserService.findOne(userById)
  }

  @GrpcMethod('UserService')
  async findByIds(userByIds: IUserByIds) {
    const data = await this.internalUserService.findByIds(userByIds)
    return { data }
  }

  @GrpcMethod('UserService')
  async findByEmails(userByEmails: IUserByEmails) {
    const data = await this.internalUserService.findByEmails(userByEmails)
    return { data }
  }

  @GrpcMethod('UserService')
  async findByEmail(userByEmail: IUserByEmail) {
    return await this.internalUserService.findByEmail(userByEmail)
  }

  @GrpcMethod('UserService')
  async unbanUser(unbanUser: IUnbanUser): Promise<IPostResponse> {
    return await this.internalUserService.unbanUser(unbanUser)
  }

  @GrpcMethod('UserService')
  async banUser(banUser: IBanUser): Promise<IPostResponse> {
    return await this.internalUserService.banUser(banUser)
  }

  @GrpcMethod('UserService')
  async deleteUser(userById: IDataById): Promise<ResponseString> {
    const result = new ResponseString()

    await this.userService.deleteUser(userById.id)

    result.response = 'DONE'
    return result
  }

  @GrpcMethod('UserService')
  async getListUserForManagement(userFilter: IUserFilterForManagement) {
    return await this.newAdminUserService.getListUserForManagement(userFilter)
  }

  @GrpcMethod('UserService')
  async searchByFilter(userFilter: IUserFilter) {
    return await this.userService.searchByFilter(userFilter)
  }

  @GrpcMethod('UserService')
  async getListUserForMarketing(userFilterMarketing: IUserFilterMarketing) {
    return await this.newAdminUserService.getListUserForMarketing(
      userFilterMarketing,
    )
  }

  @GrpcMethod('UserService')
  async getUsersExport(type: UserExportTypeInterface) {
    return await this.internalUserService.getUsersExport(type)
  }

  @GrpcMethod('UserService')
  async createUsersExport(userFilter: IUserFilter) {
    return await this.internalUserService.addExportUserProcess(userFilter)
  }

  @GrpcMethod('UserService')
  async createUserMarketingExport(userFilter: IUserFilterMarketing) {
    return await this.internalUserService.addExportUserMarketingProcess(
      userFilter,
    )
  }

  @GrpcMethod('UserService')
  async getListUserForHotWallet(
    userFilterForHotWallet: IUserFilterForHotWallet,
  ) {
    return await this.newAdminUserService.getListUserForHotWallet(
      userFilterForHotWallet,
    )
  }

  @GrpcMethod('UserService')
  async createBot(createBotDto: ICreateBotDto) {
    return await this.internalUserService.createBot(createBotDto)
  }

  @GrpcMethod('UserService')
  async validateAuthenticatorOtp(validateOtpDto: IValidateOtpDto) {
    return await this.internalUserService.validateAuthenticatorOtp(
      validateOtpDto,
    )
  }

  @GrpcMethod('UserService')
  async resetAuthenticator(dataById: IDataById): Promise<IPostResponse> {
    return await this.internalUserService.resetAuthenticator(dataById.id)
  }

  @GrpcMethod('UserService')
  async changeEmail(changeEmailDto: {
    userId: string
    email: string
  }): Promise<IPostResponse> {
    return await this.internalUserService.changeEmail(
      changeEmailDto.userId,
      changeEmailDto.email,
    )
  }
}
