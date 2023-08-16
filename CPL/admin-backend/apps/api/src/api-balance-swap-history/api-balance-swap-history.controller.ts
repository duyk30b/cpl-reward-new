import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ListBalanceSwapRequest } from '@lib/grpc-client/balance-swap-history/balance-swap-history.dto'
import { ApiBalanceSwapHistoryService } from './api-balance-swap-history.service'

@ApiBearerAuth('access-token')
@ApiTags('Balance Swap History')
@Controller('swap-history')
export class ApiBalanceSwapHistoryController {
  constructor(
    private balanceSwapHistoryService: ApiBalanceSwapHistoryService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list balance swap history' })
  @CheckPermission(Permission.BALANCE_SWAP_HISTORY)
  async listBalanceSwapHistory(@Query() params: ListBalanceSwapRequest) {
    return this.balanceSwapHistoryService.listBalanceSwapHistory(params)
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all balance swap history' })
  @CheckPermission(Permission.BALANCE_SWAP_HISTORY)
  async getAllUserBalanceChangeHistory(
    @Query() params: ListBalanceSwapRequest,
  ) {
    return this.balanceSwapHistoryService.getAllBalanceSwapHistory(params)
  }
}
