import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  ApiGroupNotificationDto,
  GroupNotificationFilterDto,
  NotificationImageDto,
} from './api-notification.dto'
import { ApiNotificationService } from './api-notification.service'

@ApiTags('notification')
@Controller('notification')
export class ApiNotificationController {
  constructor(
    private readonly apiNotificationService: ApiNotificationService,
  ) {}

  @Get('')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.GLOBAL_NOTIFICATION_READ)
  async getList(@Query() filterDto: GroupNotificationFilterDto) {
    return await this.apiNotificationService.getList(filterDto)
  }

  @Get('supported-langs')
  @ApiBearerAuth('access-token')
  async getSupportedLangs() {
    return await this.apiNotificationService.getSupportedLangs()
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.GLOBAL_NOTIFICATION_READ)
  async findById(@Param('id') id: string) {
    return await this.apiNotificationService.findById(id)
  }

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.GLOBAL_NOTIFICATION_CREATE)
  async create(@Body() createDto: ApiGroupNotificationDto) {
    return await this.apiNotificationService.create(createDto)
  }

  @Post('upload-image')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @CheckPermission(Permission.GLOBAL_NOTIFICATION_CREATE)
  async uploadImage(@UploadedFile() file: NotificationImageDto) {
    return await this.apiNotificationService.uploadImage(file)
  }

  @Post(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.GLOBAL_NOTIFICATION_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateDto: ApiGroupNotificationDto,
  ) {
    return await this.apiNotificationService.update(id, updateDto)
  }
}
