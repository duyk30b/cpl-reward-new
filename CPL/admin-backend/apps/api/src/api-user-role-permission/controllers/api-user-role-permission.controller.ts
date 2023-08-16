import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApiGetUserRolePermissionDto } from '../dto/api-user-role-permission.dto'
import { ApiUserRolePermissionService } from '../services/api-user-role-permission.service'

@ApiTags('user-role-permission')
@Controller('user-role-permission')
export class ApiUserRolePermissionController {
  constructor(
    private readonly apiUserRolePermissionService: ApiUserRolePermissionService,
  ) {}

  @Get()
  @ApiBearerAuth('access-token')
  async getUserRolePermission(
    @Query() apiGetUserRolePermissionDto: ApiGetUserRolePermissionDto,
  ) {
    return await this.apiUserRolePermissionService.getUserRolePermission(
      apiGetUserRolePermissionDto.userId,
    )
  }
}
