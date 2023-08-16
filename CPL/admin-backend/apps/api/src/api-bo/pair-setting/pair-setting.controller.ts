import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApiCreatePairSettingDTO,
  ApiUpdatePairSettingDTO,
  ApiDeletePairSettingDTO,
  ApiListPairSettingDTO,
} from './pair-setting.dto'
import { PairSettingService } from './pair-setting.service'

@ApiTags('Pair Setting')
@Controller('bo/setting')
export class PairSettingController {
  constructor(private readonly boPairSettingService: PairSettingService) {}

  //Pair Setting
  @Get('/pair-settings')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getPairSettings(@Query() filter) {
    return await this.boPairSettingService.getPairSetting(filter)
  }

  @Post('/pair-settings')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  async addPairSetting(
    @Body() apiCreatePairSettingDTO: ApiCreatePairSettingDTO,
  ) {
    return await this.boPairSettingService.addPairSetting(
      apiCreatePairSettingDTO,
    )
  }

  @Patch('/pair-settings')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updatePairSettings(
    @Body() apiUpdatePairSettingDTO: ApiUpdatePairSettingDTO[],
  ) {
    return await this.boPairSettingService.updatePairSettings(
      apiUpdatePairSettingDTO,
    )
  }

  @Patch('/pair-settings/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_UPDATE)
  async updatePairSetting(
    @Body() apiUpdatePairSettingDTO: ApiUpdatePairSettingDTO,
  ) {
    return await this.boPairSettingService.updatePairSetting(
      apiUpdatePairSettingDTO,
    )
  }

  @Delete('/pair-settings/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_DELETE)
  async deletePairSetting(
    @Param() apiDeletePairSettingDTO: ApiDeletePairSettingDTO,
  ) {
    return await this.boPairSettingService.deletePairSetting(
      apiDeletePairSettingDTO,
    )
  }

  @Get('/pair-settings/export')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.HIGH_LOW_PAIR_SETTING_READ)
  async exportPairSetting(@Query() listPairSettingDTO: ApiListPairSettingDTO) {
    return await this.boPairSettingService.exportPairSetting(listPairSettingDTO)
  }
}
