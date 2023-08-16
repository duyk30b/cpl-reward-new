import { Controller, Get, Query } from '@nestjs/common'
import { ApiHistoryService } from './api-history.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {
  EmailChangeHistoryFilterDto,
  HistoryLoginFilterDto,
} from './api-history.dto'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'

@ApiTags('history')
@Controller('history')
export class ApiHistoryController {
  constructor(private readonly apiHistoryService: ApiHistoryService) {}

  @ApiBearerAuth('access-token')
  @Get('/login')
  @CheckPermission(Permission.USER_LOGIN_HISTORY_READ)
  async getListUserLoginHistory(
    @Query() historyLoginFilterDto: HistoryLoginFilterDto,
  ) {
    return await this.apiHistoryService.getListLoginHistory(
      historyLoginFilterDto,
    )
  }

  @ApiBearerAuth('access-token')
  @Get('/email-change')
  @CheckPermission(Permission.USER_EMAIL_CHANGE_HISTORY_READ)
  async getListEmailChangeHistory(
    @Query() filter: EmailChangeHistoryFilterDto,
  ) {
    return await this.apiHistoryService.getListEmailChangeHistory(filter)
  }
}
