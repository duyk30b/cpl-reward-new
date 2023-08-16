import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ApiRejectionReasonService } from './api-rejection-reason.service'

@ApiTags('rejection-reason')
@Controller('rejection-reason')
export class ApiRejectionReasonController {
  constructor(
    private readonly apiRejectionReasonService: ApiRejectionReasonService,
  ) {}

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.REJECT_REASON_GET_LIST)
  async getAllReasonCategories() {
    return await this.apiRejectionReasonService.getAllReasonCategories()
  }
}
