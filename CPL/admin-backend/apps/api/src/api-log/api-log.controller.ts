import { FilterAdminActionLogDto } from '@lib/log/dtos/filter-admin-action-log.dto'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LogService } from 'libs/log/src/log.service'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'

@ApiTags('log')
@ApiBearerAuth('access-token')
@Controller('log')
export class ApiLogController {
  constructor(private readonly logService: LogService) {}

  @Get('')
  @CheckPermission(Permission.ACTION_LOG_HISTORY_READ)
  async find(@Query() filter: FilterAdminActionLogDto) {
    const data = await this.logService.find(filter)
    return data
  }
}
