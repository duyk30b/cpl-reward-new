import { Injectable } from '@nestjs/common'
import { RoleService } from 'libs/role-permission/src/services/role.service'
import {
  ApiCreateRoleDto,
  ApiSearchRoleDto,
  ApiUpdateRoleDto,
} from '../dto/api-role.dto'
import { PermissionAggregateService } from '@lib/role-permission/services/permission-aggregate.service'

@Injectable()
export class ApiRoleService {
  constructor(
    private roleService: RoleService,
    private permissionAggregateService: PermissionAggregateService,
  ) {}

  async create(apiCreateRoleDto: ApiCreateRoleDto) {
    return await this.permissionAggregateService.createRoleWithPermissions(
      apiCreateRoleDto,
    )
  }

  async getAll() {
    return await this.roleService.getAll()
  }

  async search(apiSearchRoleDto: ApiSearchRoleDto) {
    return await this.roleService.search(apiSearchRoleDto)
  }

  async findById(roleId: string) {
    return await this.permissionAggregateService.findRoleByIdWithPermissions(
      roleId,
    )
  }

  async update(id: string, apiUpdateRoleDto: ApiUpdateRoleDto) {
    return await this.permissionAggregateService.updateRoleWithPermissionsAndScreens(
      id,
      apiUpdateRoleDto,
    )
  }

  async delete(roleId: string) {
    return await this.roleService.delete(roleId)
  }
}
