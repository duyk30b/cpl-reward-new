import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  FilterHistoryTransferDTO,
  ListUserBalanceDTO,
} from './user-balance.dto'
import { UserBalanceService } from './user-balance.service'

@ApiTags('BO Balance')
@Controller('bo')
export class UserBalanceController {
  constructor(private readonly apiUserBalanceService: UserBalanceService) {}

  @Get('/user-balances')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async list(@Query() listUserBalanceDTO: ListUserBalanceDTO) {
    return await this.apiUserBalanceService.list(listUserBalanceDTO)
  }

  @Get('/user-balances/summary')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async summary() {
    return await this.apiUserBalanceService.getSummary()
  }

  @Get('/user-balances/export')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() listUserBalanceDTO: ListUserBalanceDTO) {
    return await this.apiUserBalanceService.export(listUserBalanceDTO)
  }

  @Get('/list-export')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async listExport() {
    return await this.apiUserBalanceService.listExport({})
  }

  @Get('/user-balances/transfers')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async listTransfers(@Query() filter: FilterHistoryTransferDTO) {
    return await this.apiUserBalanceService.listTransfers(filter)
  }

  @Get('/user-balances/transfers/export')
  @CheckPermission(Permission.HIGH_LOW_USER_BALANCE_READ)
  @ApiBearerAuth('access-token')
  async exportTransfers(@Query() filter: FilterHistoryTransferDTO) {
    return await this.apiUserBalanceService.exportTransfers(filter)
  }
}
