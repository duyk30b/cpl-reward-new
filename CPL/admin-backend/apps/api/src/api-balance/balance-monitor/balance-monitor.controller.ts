import { jsonToCsv } from '@app/common'
import { timeWithFormat } from '@lib/util'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  CheckBalanceInvalidRequest,
  CorrectRequest,
  GetAbnormalBalanceAccountsRequest,
  GetAbnormalBalanceHistoriesRequest,
  GetAbnormalBalanceUsersRequest,
  GetDiffBalanceRequest,
} from './balance-monitor.dto'
import { BalanceMonitorService } from './balance-monitor.service'

@ApiBearerAuth('access-token')
@ApiTags('balance')
@Controller('balance-monitor')
@Injectable()
export class BalanceMonitorController {
  constructor(private apiBalanceMonitorService: BalanceMonitorService) {}

  @Post('correct')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async correct(@Body() request: CorrectRequest) {
    return await this.apiBalanceMonitorService.correct(request)
  }

  @Get('get-diff-balance-correct')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async getDiffBalanceCorrect(@Query() request: GetDiffBalanceRequest) {
    return await this.apiBalanceMonitorService.getDiffBalanceCorrect(request)
  }

  @Post('check-balance-invalid')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async checkBalanceInvalid(@Body() request: CheckBalanceInvalidRequest) {
    return this.apiBalanceMonitorService.checkBalanceInvalid(request)
  }

  @Get('abnormal-balance-users')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async getAbnormalBalanceUsers(
    @Query() request: GetAbnormalBalanceUsersRequest,
  ) {
    return await this.apiBalanceMonitorService.getAbnormalBalanceUsers(request)
  }

  @Get(':userId/abnormal-balance-accounts')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async getAbnormalBalanceAccounts(
    @Param() request: GetAbnormalBalanceAccountsRequest,
  ) {
    return await this.apiBalanceMonitorService.getAbnormalBalanceAccounts(
      request,
    )
  }

  @Get('abnormal-balance-histories')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async getAbnormalBalanceHistories(
    @Query() request: GetAbnormalBalanceHistoriesRequest,
  ) {
    return await this.apiBalanceMonitorService.getAbnormalBalanceHistories(
      request,
    )
  }

  @Get('abnormal-balance-histories/csv')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_ABNORMAL_READ)
  async getAbnormalBalanceHistoriesCsv(
    @Query() request: GetAbnormalBalanceHistoriesRequest,
  ) {
    const result =
      await this.apiBalanceMonitorService.getAbnormalBalanceHistories(
        request,
        true,
      )
    const data = result.data.map((item) => {
      delete item.abnormal_balance_account
      item.created_at = timeWithFormat(+item.created_at)
      return item
    })
    return jsonToCsv(data)
  }
}
