import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { InternalUserInfoService } from './internal-user-info.service'
import { IDataByUserId } from '@lib/util/util.interface'
import { IUpdateInfoDto } from './internal-user-info.interface'

@Controller()
export class InternalUserInfoController {
  constructor(
    private readonly internalUserInfoService: InternalUserInfoService,
  ) {}

  @GrpcMethod('UserInfoService')
  async findByUserId(userInfoByUserId: IDataByUserId) {
    return await this.internalUserInfoService.findByUserId(userInfoByUserId)
  }

  @GrpcMethod('UserInfoService')
  async getListUserInfoHistory(dataByUserId: IDataByUserId) {
    return await this.internalUserInfoService.getListUserInfoHistory(
      dataByUserId,
    )
  }

  @GrpcMethod('UserInfoService')
  async updateUserInfo(updateInfoDto: IUpdateInfoDto) {
    return await this.internalUserInfoService.updateUserInfo(updateInfoDto)
  }
}
