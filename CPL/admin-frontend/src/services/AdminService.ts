import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import {
  Admin,
  AdminListPayloadModel,
  IAdminParams,
} from '@/models/admin-permission/Admin'
import { Optional } from '@/models/common/Optional'
import { PostResponse } from '@/models/common/Response'
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer'

export class AdminService {
  public static async getListAdmins(params: IAdminParams): Promise<any> {
    const transformedParams = plainToClass(AdminListPayloadModel, params)
    return await ApiService.get(`/admin`, { params: transformedParams })
  }

  public static async findByIdWithRoleAndPermission(
    id: string,
  ): Promise<Optional<Admin>> {
    const response = await ApiService.get(`/admin/${id}/permissions`)
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(Admin, response.data)
  }

  public static async createAdmin(data): Promise<PostResponse> {
    const response = await ApiService.post(`/admin`, instanceToPlain(data))
    return response.data
  }

  public static async setPermission(id: string, data): Promise<PostResponse> {
    const response = await ApiService.post(
      `/admin/${id}/permissions`,
      instanceToPlain(data),
    )
    return response.data
  }
}
