import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  AdminFilterDto,
  CreateAdminDto,
  SetPermissionsDto,
} from './api-admin.dto'
import { ApiAdminService } from './api-admin.service'

@ApiTags('admin')
@Controller('admin')
export class ApiAdminController {
  constructor(private readonly apiAdminService: ApiAdminService) {}

  @Get()
  @CheckPermission(Permission.ADMIN_GET_LIST)
  findAll(@Query() adminFilterDto: AdminFilterDto) {
    return this.apiAdminService.findAll(adminFilterDto)
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.ADMIN_CREATE)
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.apiAdminService.createAdmin(createAdminDto)
  }

  @Get(':id/permissions')
  @CheckPermission(Permission.ADMIN_READ)
  findByIdWithRoleAndPermission(@Param('id') adminId: string) {
    return this.apiAdminService.findByIdWithRoleAndPermissionAndScreen(adminId)
  }

  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.ADMIN_SET_PERMISSION)
  setPermissions(
    @Param('id') adminId: string,
    @Body() setPermissionsDto: SetPermissionsDto,
  ) {
    return this.apiAdminService.setPermissionsAndScreens(
      adminId,
      setPermissionsDto,
    )
  }
}
