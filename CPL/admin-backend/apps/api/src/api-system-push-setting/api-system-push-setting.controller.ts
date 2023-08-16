import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  SystemPushSettingFilterDto,
  ToggleActiveDto,
  UpdateSystemPushNotificationSettingDto,
} from './api-system-push-setting.dto'
import { ApiSystemPushSettingService } from './api-system-push-setting.service'

@Controller('system-push-setting')
export class ApiSystemPushSettingController {
  constructor(
    private readonly apiSystemPushSettingService: ApiSystemPushSettingService,
  ) {}

  @Get('')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.SYSTEM_PUSH_SETTING_READ)
  async getListSetting(@Query() filterDto: SystemPushSettingFilterDto) {
    return await this.apiSystemPushSettingService.getListSetting(filterDto)
  }

  @Get('types')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.SYSTEM_PUSH_SETTING_READ)
  async getTypes() {
    return await this.apiSystemPushSettingService.getTypes()
  }

  @Get('supported-langs')
  @ApiBearerAuth('access-token')
  async getSupportedLangs() {
    return await this.apiSystemPushSettingService.getSupportedLangs()
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.SYSTEM_PUSH_SETTING_READ)
  async findSettingById(@Param('id') id: string) {
    return await this.apiSystemPushSettingService.findSettingById(id)
  }

  @Post(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.SYSTEM_PUSH_SETTING_UPDATE)
  async updateSetting(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSystemPushNotificationSettingDto,
  ) {
    return await this.apiSystemPushSettingService.updateSetting(
      id,
      updateSettingDto,
    )
  }

  @Post(':id/toggle-active')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.SYSTEM_PUSH_SETTING_UPDATE)
  async toggleActive(
    @Param('id') id: string,
    @Body() toggleActiveDto: ToggleActiveDto,
  ) {
    return await this.apiSystemPushSettingService.toggleActive(
      id,
      toggleActiveDto,
    )
  }
}
