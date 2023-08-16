import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import {
  UpdateUserInfoDto,
  UserInfo,
  UserInfoHistory,
} from '@/models/user/UserInfo'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class UserInfoService {
  public static async findByUserId(
    userId: string,
  ): Promise<Optional<UserInfo>> {
    const response = await ApiService.get(`/user-info/detail`, {
      params: { user_id: userId },
    })
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(UserInfo, response.data)
  }

  public static async getListUserInfoHistory(
    userId: string,
  ): Promise<UserInfoHistory[]> {
    const response = await ApiService.get(`/user-info/history`, {
      params: { user_id: userId },
    })
    if (response.status != HttpStatus.OK) {
      return []
    }
    return (response.data || []).map((e) => plainToInstance(UserInfoHistory, e))
  }

  public static async update(userId: string, data: UpdateUserInfoDto) {
    const response = await ApiService.post(
      `/user-info/${userId}`,
      instanceToPlain(data),
    )
    return response.data
  }
}
