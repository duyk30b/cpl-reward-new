import { CoinSettingService } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.service'
import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
@ApiTags('coin')
@Controller('coin')
export class ApiCoinController {
  constructor(private coinSettingService: CoinSettingService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.COIN_GET_LIST)
  async findAll() {
    return await this.coinSettingService.getAllListCoin()
  }
}
