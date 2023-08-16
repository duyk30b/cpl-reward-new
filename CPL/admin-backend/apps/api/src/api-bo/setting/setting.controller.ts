import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApiCreateBOSettingDTO,
  ApiUpdateBOSettingDTO,
  ApiDeleteBOSettingDTO,
  ApiFindOneBOMajorCoinDto,
  ApiUpdateBOMajorCoinDto,
  ApiCreateBOMajorCoinDto,
} from './setting.dto'
import { SettingService } from './setting.service'

@ApiTags('Pair Setting')
@Controller('bo/setting')
export class SettingController {
  constructor(private readonly boSettingService: SettingService) {}

  //BO Setting
  @Get('/bo-settings')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  async getBOSetting(@Query() filter) {
    return await this.boSettingService.getBOSetting(filter)
  }

  @Post('/bo-settings')
  @CheckPermission(Permission.HIGH_LOW_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  async createBOSetting(@Body() apiCreateBOSettingDTO: ApiCreateBOSettingDTO) {
    return await this.boSettingService.createBOSetting(apiCreateBOSettingDTO)
  }

  @Patch('/bo-settings')
  @CheckPermission(Permission.HIGH_LOW_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateBOSettings(
    @Body() apiUpdateBOSettingsDTO: ApiUpdateBOSettingDTO[],
  ) {
    return await this.boSettingService.updateBOSettings(apiUpdateBOSettingsDTO)
  }

  @Patch('/bo-settings/:id')
  @CheckPermission(Permission.HIGH_LOW_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateBOSetting(@Body() apiUpdateBOSettingDTO: ApiUpdateBOSettingDTO) {
    return await this.boSettingService.updateBOSetting(apiUpdateBOSettingDTO)
  }

  @Delete('/bo-settings/:id')
  @CheckPermission(Permission.HIGH_LOW_SETTING_DELETE)
  @ApiBearerAuth('access-token')
  async deleteBOSetting(@Param() apiDeleteBOSettingDTO: ApiDeleteBOSettingDTO) {
    return await this.boSettingService.deleteBOSetting(apiDeleteBOSettingDTO)
  }

  @Get('/btc-transfer-setting')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getBTCTransferSetting() {
    return await this.boSettingService.getBTCTransferSetting()
  }

  @Patch('/btc-transfer-setting')
  @CheckPermission(Permission.HIGH_LOW_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateBTCTransferHistory(
    @Body() apiUpdateBOSettingsDTO: ApiUpdateBOSettingDTO[],
  ) {
    return await this.boSettingService.updateBTCTransferSetting(
      apiUpdateBOSettingsDTO,
    )
  }

  @Get('/btc-transfer-history')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getBTCTransferHistory(@Query() filter) {
    return await this.boSettingService.getBTCTransferHistory(filter)
  }

  @Get('/major')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getMajorCoin() {
    return await this.boSettingService.getMajorCoin()
  }

  @Get('/major/:coin')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getDetailMajorCoin(
    @Param() apiFindOneBOMajorCoinDto: ApiFindOneBOMajorCoinDto,
  ) {
    return await this.boSettingService.getDetailMajorCoin(
      apiFindOneBOMajorCoinDto,
    )
  }

  @Post('/major/:coin')
  @CheckPermission(Permission.HIGH_LOW_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  async createMajorCoin(
    @Param() apiCreateBOMajorCoinDto: ApiCreateBOMajorCoinDto,
  ) {
    return await this.boSettingService.createMajorCoin(apiCreateBOMajorCoinDto)
  }

  @Put('/major')
  @CheckPermission(Permission.HIGH_LOW_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateMajorCoin(
    @Body() apiUpdateBOMajorCoinDto: ApiUpdateBOMajorCoinDto,
  ) {
    return await this.boSettingService.updateMajorCoin(apiUpdateBOMajorCoinDto)
  }

  @Delete('/major')
  @CheckPermission(Permission.HIGH_LOW_SETTING_DELETE)
  @ApiBearerAuth('access-token')
  async deleteMajorCoin(
    @Body() apiDeleteBOMajorCoinDto: ApiFindOneBOMajorCoinDto,
  ) {
    return await this.boSettingService.deleteMajorCoin(apiDeleteBOMajorCoinDto)
  }
}
