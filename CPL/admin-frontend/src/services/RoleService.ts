import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Role } from '@/models/admin-permission/Role'
import { Optional } from '@/models/common/Optional'
import { PostResponse } from '@/models/common/Response'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class RoleService {
  public static async getListRoles(params) {
    return await ApiService.get(`/role`, { params: params })
  }

  public static async findById(id: string): Promise<Optional<Role>> {
    const response = await ApiService.get(`/role/${id}`)
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(Role, response.data)
  }

  public static async createRole(data): Promise<PostResponse> {
    const response = await ApiService.post(`/role`, instanceToPlain(data))
    return response.data
  }

  public static async updateRole(id: string, data): Promise<PostResponse> {
    const response = await ApiService.post(`/role/${id}`, instanceToPlain(data))
    return response.data
  }

  public static async deleteRole(id: string): Promise<PostResponse> {
    const response = await ApiService.delete(`/role/${id}`)
    return response.data
  }
}
