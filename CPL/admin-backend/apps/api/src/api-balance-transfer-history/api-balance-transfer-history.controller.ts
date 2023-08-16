import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ListBalanceTransferRequest } from '@lib/grpc-client/balance-transfer-history/balance-transfer-history.dto'
import { ApiBalanceTransferHistoryService } from './api-balance-transfer-history.service'

@ApiBearerAuth('access-token')
@ApiTags('Balance Transfer History')
@Controller('transfer-history')
export class ApiBalanceTransferHistoryController {
  constructor(
    private balanceTransferHistoryService: ApiBalanceTransferHistoryService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list balance transfer history' })
  @CheckPermission(Permission.BALANCE_TRANSFER_HISTORY)
  async listBalanceTransferHistory(
    @Query() params: ListBalanceTransferRequest,
  ) {
    return this.balanceTransferHistoryService.listBalanceTransferHistory(params)
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all balance transfer history' })
  @CheckPermission(Permission.BALANCE_TRANSFER_HISTORY)
  async getAllUserBalanceChangeHistory(
    @Query() params: ListBalanceTransferRequest,
  ) {
    return this.balanceTransferHistoryService.getAllBalanceTransferHistory(
      params,
    )
  }
}
