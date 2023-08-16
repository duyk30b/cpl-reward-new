import { jsonToCsv } from '@app/common'
import { timeWithFormat } from '@lib/util'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import { ListBalanceHistoryRequestDto } from './balance-history.dto'
import { BalanceHistoryService } from './balance-history.service'

@ApiBearerAuth('access-token')
@ApiTags('balance')
@Controller('balance-history')
@Injectable()
export class BalanceHistoryController {
  constructor(private apiBalanceHistoryService: BalanceHistoryService) {}

  @Get('list')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_HISTORY)
  async list(
    @Query() listBalanceHistoryRequestDto: ListBalanceHistoryRequestDto,
  ) {
    return await this.apiBalanceHistoryService.list(
      listBalanceHistoryRequestDto,
    )
  }

  @Get('list/csv')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_HISTORY)
  async listCsv(
    @Query() listBalanceHistoryRequestDto: ListBalanceHistoryRequestDto,
  ) {
    const result = await this.apiBalanceHistoryService.list(
      listBalanceHistoryRequestDto,
      true,
    )
    const data = result.data.map((item) => {
      item.created_at = timeWithFormat(+item.created_at)
      return item
    })
    // console.log(data[0])
    return jsonToCsv(data)
  }
}
