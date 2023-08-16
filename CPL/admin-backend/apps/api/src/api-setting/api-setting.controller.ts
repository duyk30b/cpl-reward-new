import { Controller, Get } from '@nestjs/common'
import { ApiSettingService } from './api-setting.service'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

@Controller('setting')
@ApiTags('setting')
export class ApiSettingController {
  constructor(private readonly settingService: ApiSettingService) {}

  @ApiOperation({ summary: 'Get country code list' })
  // @CheckPermission(Permission.SETTING_COUNTRY_CODE_GET_LIST)
  @Get('country-code')
  @ApiBearerAuth('access-token')
  async getCountryCode() {
    return await this.settingService.getCountryCodeSetting()
  }
}
