import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ApiNotificationCategoryService } from './api-notification-category.service'

@ApiTags('notification')
@Controller('notification-category')
export class ApiNotificationCategoryController {
  constructor(
    private readonly apiNotificationCategoryService: ApiNotificationCategoryService,
  ) {}

  @Get('')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.NOTIFICATION_CATEGORY_READ)
  async getList() {
    return await this.apiNotificationCategoryService.getList()
  }
}
