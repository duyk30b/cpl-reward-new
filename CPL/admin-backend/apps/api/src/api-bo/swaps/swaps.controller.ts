import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import { ListSwapsRequestDTO } from './swaps.dto'
import { SwapsService } from './swaps.service'

@ApiTags('BO Swaps')
@Controller('bo/swaps')
export class SwapsController {
  constructor(private readonly swapsService: SwapsService) {}

  @Get('/export')
  @CheckPermission(Permission.HIGH_LOW_SETTING_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() filter: ListSwapsRequestDTO) {
    return await this.swapsService.export(filter)
  }
}
