import { Admin, AdminService } from '@lib/admin'
import { PermissionAggregateService } from '@lib/role-permission/services/permission-aggregate.service'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CHECK_ABILITY } from './abilities.decorator'

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionAggregateService: PermissionAggregateService,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionId = this.reflector.get<number>(
      CHECK_ABILITY,
      context.getHandler(),
    )

    const accessTokenInfo = context.switchToHttp().getRequest().accessTokenInfo
    const admin = await this.adminService.getAdminByIdWithCache(
      accessTokenInfo.uid,
    )

    const hasPermission = await this.checkPermission(admin, permissionId)

    if (!hasPermission) {
      throw new ForbiddenException('Permission Denied')
    }

    return true
  }

  private async checkPermission(admin: Admin, permissionId: number) {
    if (admin.isRoot) return true

    const permissions =
      await this.permissionAggregateService.getUserRolePermission(admin.id)

    return permissions.find((id) => id == permissionId)
  }
}
