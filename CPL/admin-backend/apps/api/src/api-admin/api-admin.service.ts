import { AdminService } from '@lib/admin'
import { UserRoleService } from '@lib/role-permission'
import { PermissionAggregateService } from '@lib/role-permission/services/permission-aggregate.service'
import { UserPermissionService } from '@lib/role-permission/services/user-permission.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import {
  AdminFilterDto,
  CreateAdminDto,
  SetPermissionsDto,
} from './api-admin.dto'
import { AdminScreenService } from '@lib/role-permission/services/user-screen.service'

@Injectable()
export class ApiAdminService {
  constructor(
    private adminService: AdminService,
    private userRoleService: UserRoleService,
    private userPermissionService: UserPermissionService,
    private adminScreenService: AdminScreenService,
    private permissionAggregateService: PermissionAggregateService,
  ) {}

  async findAll(adminFilterDto: AdminFilterDto) {
    return await this.adminService.findAll(adminFilterDto)
  }

  async findByIdWithRoleAndPermissionAndScreen(adminId: string) {
    const admin = await this.adminService.getAdminById(adminId)
    if (!admin) throw new NotFoundException()
    admin.roles = await this.userRoleService.getRolesByUserId(adminId)
    admin.directPermissions =
      await this.userPermissionService.getPermissionsByUserId(adminId)
    admin.directScreens = await this.adminScreenService.getScreensByUserId(
      adminId,
    )
    return admin
  }

  async setPermissionsAndScreens(
    adminId: string,
    setPermissionsDto: SetPermissionsDto,
  ) {
    await this.permissionAggregateService.addRolePermissionScreenToAdmin(
      adminId,
      setPermissionsDto.roles,
      setPermissionsDto.directPermissions,
      setPermissionsDto.directScreens,
    )

    return { success: true }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.createAdmin(createAdminDto)
    return {
      success: true,
      admin: admin,
    }
  }
}
