import { BusinessException } from '@lib/util'
import {
  Body,
  Query,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Get,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import { BALANCE_TYPE, ERRORS } from '../balance.enum'
import { TransformInterceptor } from '../transform-interceptor.interface'
import {
  CreateTransactionRequest,
  BalanceChangeHistoryRequest,
} from './balance-transaction.dto'
import { BalanceTransactionService } from './balance-transaction.service'
@ApiBearerAuth('access-token')
@ApiTags('balance')
@UseInterceptors(TransformInterceptor)
@Injectable()
@Controller('transaction')
export class BalanceTransactionController {
  constructor(private transactionService: BalanceTransactionService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ADD)
  @ApiOperation({ summary: 'Create transaction via admin-v3' })
  async create(@Body() createRequest: CreateTransactionRequest) {
    if (
      createRequest.balance_type === BALANCE_TYPE[BALANCE_TYPE.BO] &&
      createRequest.currency !== 'bcast' &&
      createRequest.currency !== 'usdt'
    ) {
      throw new BusinessException(ERRORS.BALANCE_ACCOUNT_NOT_FOUND)
    }
    if (
      createRequest.balance_type === BALANCE_TYPE[BALANCE_TYPE.CASHBACK] &&
      createRequest.currency !== 'usdt'
    ) {
      throw new BusinessException(ERRORS.BALANCE_ACCOUNT_NOT_FOUND)
    }
    return this.transactionService.createTransaction(createRequest)
  }

  @Get('user-balance-change-history')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.USER_BALANCE_CHANGE_HISTORY)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user balance change history' })
  async getUserBalanceChangeHistory(
    @Query() params: BalanceChangeHistoryRequest,
  ) {
    return this.transactionService.getUserBalanceChangeHistory(params)
  }

  @Get('get-all-balance-change-history')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.USER_BALANCE_CHANGE_HISTORY)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all data user balance change history' })
  async getAllUserBalanceChangeHistory(
    @Query() params: BalanceChangeHistoryRequest,
  ) {
    return this.transactionService.getAllUserBalanceChangeHistory(params)
  }
}
