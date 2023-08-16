import { GBalanceMonitorService } from '@lib/grpc-client/balance-monitor/balance-monitor.service'
import { UserService } from '@lib/grpc-client/user'
import { Injectable } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { CORRECTED_TYPE, RUN_CHECK_BALANCE_TYPE } from '../balance.enum'
import {
  CheckBalanceInvalidRequest,
  CorrectRequest,
  GetAbnormalBalanceAccountsRequest,
  GetAbnormalBalanceHistoriesRequest,
  GetAbnormalBalanceUsersRequest,
  GetDiffBalanceRequest,
} from './balance-monitor.dto'

@Injectable()
export class BalanceMonitorService {
  constructor(
    private gBalanceMonitorService: GBalanceMonitorService,
    private userService: UserService,
  ) {}

  async correct(request: CorrectRequest) {
    const result = await this.gBalanceMonitorService.correct({
      userId: request.user_id,
      currency: request.currency,
      balanceType: request.balance_type,
      correctedType: request.is_update_balance
        ? CORRECTED_TYPE.CORRECT_BALANCE_ACCOUNT_TO_TRANSACTION
        : CORRECTED_TYPE.CORRECT_BALANCE_TRANSACTION_TO_ACCOUNT,
      correctedBy: request.corrected_by,
      diffActualBalance: request.diff_actual_balance,
      diffAvailableBalance: request.diff_available_balance,
      reason: request.reason,
    })
    return instanceToPlain(result)
  }

  async getDiffBalanceCorrect(request: GetDiffBalanceRequest) {
    const result = await this.gBalanceMonitorService.getDiffBalanceCorrect({
      userId: request.user_id,
      currency: request.currency,
      balanceType: request.balance_type,
    })
    return instanceToPlain(result)
  }

  async checkBalanceInvalid(request: CheckBalanceInvalidRequest) {
    return this.gBalanceMonitorService.checkBalanceInvalid({
      userId: request.user_id,
      currency: request.currency,
      balanceType: request.balance_type,
      runType: RUN_CHECK_BALANCE_TYPE.RUN_ALL,
    })
  }

  async getAbnormalBalanceUsers(request: GetAbnormalBalanceUsersRequest) {
    const result = await this.gBalanceMonitorService.getAbnormalBalanceUsers(
      request,
    )
    if (result.data.length === 0) {
      return { data: [], pagination: result.pagination }
    }
    const userIds = result.data.map((item) => item.userId)
    const users = await this.userService.findByIds(userIds)
    const data = result.data.map((item) => {
      const user = users.find((user) => user.id === item.userId)
      return {
        userId: item.userId,
        email: user ? user.email : null,
        createdAt: item.createdAt,
      }
    })
    return { data, pagination: result.pagination }
  }

  async getAbnormalBalanceAccounts(request: GetAbnormalBalanceAccountsRequest) {
    const result = await this.gBalanceMonitorService.getAbnormalBalanceAccounts(
      request,
    )
    return instanceToPlain(result)
  }

  async getAbnormalBalanceHistories(
    request: GetAbnormalBalanceHistoriesRequest,
    getAll = false,
  ) {
    const result =
      await this.gBalanceMonitorService.getAbnormalBalanceHistories({
        ...request,
        getAll,
      })
    return instanceToPlain(result)
  }
}
