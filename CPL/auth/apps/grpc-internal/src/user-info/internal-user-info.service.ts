import { AdminAggregateService } from '@lib/admin-aggregate'
import { UserInfoService } from '@lib/user'
import { Injectable } from '@nestjs/common'
import { IDataByUserId } from '@lib/util/util.interface'
import { IUpdateInfoDto } from './internal-user-info.interface'

@Injectable()
export class InternalUserInfoService {
  constructor(
    private readonly userInfoService: UserInfoService,
    private readonly adminAggregateService: AdminAggregateService,
  ) {}

  async findByUserId(userInfoByUserId: IDataByUserId) {
    const result = await this.userInfoService.getInfoByUserId(
      userInfoByUserId.userId,
    )
    return { data: result }
  }

  async getListUserInfoHistory(dataByUserId: IDataByUserId) {
    const result = await this.adminAggregateService.getListUserInfoHistory(
      dataByUserId,
    )
    return { data: result }
  }

  async updateUserInfo(updateInfoDto: IUpdateInfoDto) {
    try {
      const { userId, userInfo, idDocumentNo, remark } = updateInfoDto
      await this.adminAggregateService.updateUserInfo({
        ...userInfo,
        userId,
        idDocumentNo,
        remark,
      })
      return { success: true }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      }
    }
  }
}
