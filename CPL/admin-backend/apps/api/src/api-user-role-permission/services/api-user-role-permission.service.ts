import { Injectable } from '@nestjs/common'
import { PermissionAggregateService } from '@lib/role-permission/services/permission-aggregate.service'

@Injectable()
export class ApiUserRolePermissionService {
  constructor(private permissionAggregateService: PermissionAggregateService) {}

  async getUserRolePermission(userId: string) {
    return await this.permissionAggregateService.getUserRolePermission(userId)
  }
}
