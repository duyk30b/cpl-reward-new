import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WinningRateService } from './winning-rate.service'
import { ListWinningRateDTO } from './winning-rate.dto'
import { CheckPermission } from '../../permissions/permission.decorator'
import { Permission } from '../../permissions/permission.data'

@ApiTags('BO Winning Rate')
@Controller('bo/winning-rate')
export class WinningRateController {
  constructor(private readonly apiWinningRateService: WinningRateService) {}

  @Get('/seconds')
  //@ApiBearerAuth('access-token')
  //@CheckPermisson(Action.Read, SUBJECTS.CHANNEL_COMMON)
  @CheckPermission(Permission.HIGH_LOW_WINNING_RATE_READ)
  async getBySeconds(@Query() query: ListWinningRateDTO) {
    return await this.apiWinningRateService.getBySeconds(query)
  }

  @Get('/minutes')
  //@ApiBearerAuth('access-token')
  //@CheckPermisson(Action.Read, SUBJECTS.CHANNEL_COMMON)
  @CheckPermission(Permission.HIGH_LOW_WINNING_RATE_READ)
  async getByMinutes(@Query() query: ListWinningRateDTO) {
    return await this.apiWinningRateService.getByMinutes(query)
  }

  @Get('/hours')
  //@ApiBearerAuth('access-token')
  //@CheckPermisson(Action.Read, SUBJECTS.CHANNEL_COMMON)
  @CheckPermission(Permission.HIGH_LOW_WINNING_RATE_READ)
  async getByHours(@Query() query: ListWinningRateDTO) {
    return await this.apiWinningRateService.getByHours(query)
  }
}
