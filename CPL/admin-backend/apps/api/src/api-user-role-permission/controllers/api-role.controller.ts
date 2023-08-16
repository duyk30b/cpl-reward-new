import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApiCreateRoleDto,
  ApiSearchRoleDto,
  ApiUpdateRoleDto,
} from '../dto/api-role.dto'
import { ApiRoleService } from '../services/api-role.service'
import { Permission } from '../../permissions/permission.data'

@ApiTags('role')
@Controller('role')
export class ApiRoleController {
  constructor(private readonly apiRoleService: ApiRoleService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.ROLE_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateRoleDto: ApiCreateRoleDto) {
    return await this.apiRoleService.create(apiCreateRoleDto)
  }

  @Get('/:id')
  @CheckPermission(Permission.ROLE_READ)
  @ApiBearerAuth('access-token')
  async getById(@Param('id') roleId: string) {
    return await this.apiRoleService.findById(roleId)
  }

  @Get('')
  @CheckPermission(Permission.ROLE_GET_LIST)
  @ApiBearerAuth('access-token')
  async search(@Query() apiSearchDto: ApiSearchRoleDto) {
    return await this.apiRoleService.search(apiSearchDto)
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.ROLE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() apiUpdateRoleDto: ApiUpdateRoleDto,
  ) {
    return await this.apiRoleService.update(id, apiUpdateRoleDto)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.ROLE_DELETE)
  async deleteOne(@Param('id') roleId: string) {
    return await this.apiRoleService.delete(roleId)
  }
}
