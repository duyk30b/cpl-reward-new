import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApiPermissionService } from '../services/api-permission.service'

@ApiTags('permission')
@Controller('permission')
export class ApiPermissionController {
  constructor(private readonly apiPermissionService: ApiPermissionService) {}

  @Get()
  @ApiBearerAuth('access-token')
  async getAll() {
    return await this.apiPermissionService.getAll()
  }
}
