import { NewBalanceService } from '@libs/new-balance'
import { BalanceType } from '@libs/new-balance/grpc-services/transaction/transaction.enum'
import { WALLET } from '@libs/typeorm/common/enum'
import {
  RewardHistory,
  RewardHistoryService,
  REWARD_HISTORY_STATUS,
} from '@libs/typeorm/reward-history'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WorkerSendRewardService {
  private readonly logger = new Logger(WorkerSendRewardService.name)
  constructor(
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly newBalanceService: NewBalanceService,
  ) {}

  async startSendReward(history: RewardHistory) {
    try {
      const { balanceTransactionId } = await this.newBalanceService.startSendReward({
        userId: history.userId,
        amount: history.amount.toString(10),
        currency: history.currency.toLowerCase(),
        referenceId: history.referenceId,
        balance: BalanceType[WALLET[history.wallet]],
      })

      this.logger.log(
        ` -- Send Reward success,missionId ${history.missionId} balanceTransactionId: ${balanceTransactionId}`,
      )

      await this.rewardHistoryService.update(
        { id: history.id },
        {
          status: REWARD_HISTORY_STATUS.SUCCESS,
          balanceResponse: JSON.stringify({ balanceTransactionId }),
        },
      )
    } catch (error) {
      this.logger.error(error)
      await this.rewardHistoryService.update(
        { id: history.id },
        {
          status: REWARD_HISTORY_STATUS.FAILED,
          balanceResponse: JSON.stringify({ error: JSON.stringify(error.message) }),
        },
      )
      // throw new Error(error)
    }
  }
}
