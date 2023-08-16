import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import { PostResponse } from '@/models/common/Response'
import { GroupNotification } from '@/models/notification/Notification'
import { plainToInstance } from 'class-transformer'

export class NotificationService {
  public static async getList(params) {
    return await ApiService.get(`/notification`, { params })
  }

  public static async findById(
    id: string,
  ): Promise<Optional<GroupNotification>> {
    const response = await ApiService.get(`/notification/${id}`)
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(GroupNotification, response.data)
  }

  public static async getSupportedLangs(): Promise<string[]> {
    const response = await ApiService.get(`/notification/supported-langs`)
    if (response.status != HttpStatus.OK) {
      return []
    }
    return response.data
  }

  public static async create(data: GroupNotification): Promise<PostResponse> {
    const response = await ApiService.post(`/notification`, data.submitData)
    return response.data
  }

  public static async update(
    id: string,
    data: GroupNotification,
  ): Promise<PostResponse> {
    const response = await ApiService.post(
      `/notification/${id}`,
      data.submitData,
    )
    return response.data
  }
}
