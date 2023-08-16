import ApiService from '@/core/services/ApiService'
import { PostResponse } from '@/models/common/Response'
import { instanceToPlain } from 'class-transformer'

export class AccountService {
  public static async changePassword(data): Promise<PostResponse> {
    const response = await ApiService.post(
      `/auth/change-password`,
      instanceToPlain(data),
    )
    return response.data
  }
}
