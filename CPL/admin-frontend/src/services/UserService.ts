import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import { User } from '@/models/user/User'
import { plainToInstance } from 'class-transformer'
import { IBanUser } from '@/interfaces/reason.interface'

export class UserService {
  public static async findById(userId: string): Promise<Optional<User>> {
    const response = await ApiService.get(`/user/${userId}`)
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(User, response.data)
  }

  public static async getListUsers(params) {
    // if (response.status == HttpStatus.OK) {
    //   response.data.items = response.data.items.map((item) =>
    //     plainToInstance(UserForManagementDto, item),
    //   )
    // }
    return await ApiService.get(`/user`, { params })
  }

  public static async getUsersExport() {
    return await ApiService.get('/user/export')
  }

  public static async createUsersExport(data) {
    return await ApiService.post('/user/export', data)
  }

  public static async banUser(userId: string, data: IBanUser) {
    const result = await ApiService.post(`/user/${userId}/ban`, data)
    return result.data
  }

  public static async userBlacklistHistory(params) {
    return await ApiService.get(`/user/blacklist-history`, { params: params })
  }

  public static async unbanUser(userId: string) {
    const result = await ApiService.post(`/user/${userId}/unban`, {})
    return result.data
  }

  public static async getListBanHistories(params) {
    return await ApiService.get('/user/ban-history', { params })
  }

  public static async uploadBanUsers(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await ApiService.post('/user/ban-history/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  public static async searchByFilter(params) {
    return await ApiService.get(`/user/search`, {
      params,
    })
  }

  public static async resetAuthenticator(userId: string) {
    const result = await ApiService.post(
      `/user/${userId}/reset-authenticator`,
      {},
    )
    return result.data
  }

  public static async changeEmail(userId: string, newEmail: string) {
    const result = await ApiService.post(`/user/${userId}/change-email`, {
      new_email: newEmail,
    })
    return result.data
  }
}
