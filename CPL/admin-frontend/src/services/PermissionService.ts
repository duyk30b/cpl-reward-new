import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { PermissionDto } from '@/models/admin-permission/Permission'
import { plainToInstance } from 'class-transformer'

export class PermissionService {
  public static async getAllPermissions() {
    const response = await ApiService.get(`/permission`)
    if (response.status != HttpStatus.OK) {
      return [] as PermissionDto[]
    }
    return response.data.map((permission) =>
      plainToInstance(PermissionDto, permission),
    )
  }
}
