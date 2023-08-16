import { KongHeader } from '@libs/auth-kong'
import { NOTIFICATION_CATEGORIES } from '@libs/notification'
import { ApiCommon, IRequestWithToken } from '@libs/util'
import { Lang } from '@libs/util/decorators/param.decorator'
import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  ApiNotificationDetailResponseDto,
  NotificationCountUnreadFilterDto,
  NotificationOfUserFilterDto,
} from './api-notification.dto'
import { ApiNotificationService } from './api-notification.service'

@ApiTags('notification')
@Controller('notification')
export class ApiNotificationController {
  constructor(
    private readonly apiNotificationService: ApiNotificationService,
  ) {}

  @Get()
  @ApiHeader(ApiCommon.lang)
  @KongHeader()
  async getListNotification(
    @Req() req: IRequestWithToken,
    @Query() notificationOfUserFilterDto: NotificationOfUserFilterDto,
    @Lang() lang: string,
  ) {
    return await this.apiNotificationService.getListNotification(
      req.tokenInfo.userId,
      notificationOfUserFilterDto,
      lang,
    )
  }

  @Get('unread-count')
  @KongHeader()
  async countUnread(
    @Req() req: IRequestWithToken,
    @Query() countUnreadFilterDto: NotificationCountUnreadFilterDto,
  ) {
    return await this.apiNotificationService.countUnread(
      req.tokenInfo.userId,
      countUnreadFilterDto,
    )
  }

  @Get('categories')
  @KongHeader()
  async getAllCategories() {
    return {
      data: [
        {
          id: 0,
          name: 'NOTIFICATION.CATEGORY.ALL',
        },
        ...NOTIFICATION_CATEGORIES,
      ],
    }
  }

  @Get(':id')
  @ApiHeader(ApiCommon.lang)
  @ApiOkResponse({ type: ApiNotificationDetailResponseDto })
  @KongHeader()
  async getNotificationDetail(
    @Req() req: IRequestWithToken,
    @Param('id') typeAndId: string,
    @Lang() lang: string,
  ) {
    return await this.apiNotificationService.getNotificationDetail(
      req.tokenInfo.userId,
      typeAndId,
      lang,
    )
  }

  @Post(':id/mark-as-read')
  @KongHeader()
  async readNotification(
    @Req() req: IRequestWithToken,
    @Param('id') typeAndId: string,
  ) {
    await this.apiNotificationService.readNotification(
      req.tokenInfo.userId,
      typeAndId,
    )
    return { success: true }
  }

  @Post('mark-all-as-read')
  @KongHeader()
  async readAllNotifications(@Req() req: IRequestWithToken) {
    await this.apiNotificationService.readAllNotifications(req.tokenInfo.userId)
    return { success: true }
  }

  @Post(':id/test-push')
  @KongHeader()
  async testPushForNotification(
    @Req() req: IRequestWithToken,
    @Param('id') typeAndId: string,
  ) {
    await this.apiNotificationService.testPushForNotification(
      req.tokenInfo.userId,
      typeAndId,
    )
    return { success: true }
  }
}
