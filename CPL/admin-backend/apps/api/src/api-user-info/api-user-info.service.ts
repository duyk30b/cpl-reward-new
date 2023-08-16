import { UserInfoService } from '@lib/grpc-client/user-info'
import { Injectable } from '@nestjs/common'
import { UpdateUserInfoDto } from './api-user-info.dto'

@Injectable()
export class ApiUserInfoService {
  constructor(private readonly userInfoService: UserInfoService) {}

  async findUserInfoByUserId(userId: string) {
    return await this.userInfoService.findByUserId(userId)
  }

  async getListUserInfoHistory(userId: string) {
    return await this.userInfoService.getListUserInfoHistory(userId)
  }

  async updateUserInfo(userId: string, updateInfoDto: UpdateUserInfoDto) {
    return await this.userInfoService.updateUserInfo({
      userId,
      userInfo: updateInfoDto as any,
      idDocumentNo: updateInfoDto.idDocumentNo,
      remark: updateInfoDto.remark,
    })
  }
}
