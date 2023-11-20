import { DELIVERY_METHOD, TARGET_USER, WALLET, WALLET_LANG } from '@libs/typeorm/common/enum'
import { Mission } from '@libs/typeorm/mission'
import { RewardHistory, REWARD_HISTORY_STATUS } from '@libs/typeorm/reward-history'
import BigNumber from 'bignumber.js'
import { Expose, Transform } from 'class-transformer'

export class MissionResponse extends Mission {
  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'wallet' })
  wallet: WALLET

  @Expose({ name: 'wallet_name' })
  walletName: WALLET_LANG

  @Expose({ name: 'delivery_method' })
  deliveryMethod: DELIVERY_METHOD

  @Expose({ name: 'total_reward_amount' })
  @Transform(({ value }: { value: BigNumber }) => value.toString(10))
  totalRewardAmount: BigNumber

  @Expose({ name: 'received_amount' })
  @Transform(({ value }: { value: BigNumber }) => value.toString(10))
  receivedAmount: BigNumber

  @Expose({ name: 'not_received_amount' })
  @Transform(({ value }: { value: BigNumber }) => value.toString(10))
  notReceivedAmount: BigNumber

  @Expose({ name: 'reward_status' })
  rewardStatus: REWARD_HISTORY_STATUS

  @Expose({ name: 'completed' })
  completed: number

  static fromMission(mission: Mission): MissionResponse {
    const instance = new MissionResponse()
    Object.assign(instance, mission)

    const target = mission.grantTarget.find((i) => i.userType === TARGET_USER.USER)
    instance.currency = target.currency || ''
    instance.wallet = target.wallet
    instance.walletName = WALLET_LANG[WALLET[target.wallet]]
    instance.deliveryMethod = DELIVERY_METHOD.AUTO
    instance.totalRewardAmount = target.amount

    delete instance.grantTarget
    delete instance.displayConditions
    delete instance.userConditions
    delete instance.judgmentConditions

    return instance
  }

  static fromMissionAndHistory(mission: Mission, histories: RewardHistory[]): MissionResponse {
    const instance = MissionResponse.fromMission(mission)
    const rewardHistories = histories.filter((i) => i.missionId === mission.id)

    if (rewardHistories.length === 0) {
      instance.receivedAmount = new BigNumber('0')
      instance.notReceivedAmount = new BigNumber('0')
      instance.rewardStatus = null
      instance.completed = 0
    } else {
      instance.receivedAmount = rewardHistories
        .filter((i) => i.status === REWARD_HISTORY_STATUS.SUCCESS)
        .reduce((acc, cur) => acc.plus(cur.amount), new BigNumber(0))

      instance.notReceivedAmount = rewardHistories
        .filter((i) => i.status === REWARD_HISTORY_STATUS.FAILED || REWARD_HISTORY_STATUS.PENDING)
        .reduce((acc, cur) => acc.plus(cur.amount), new BigNumber(0))

      // neu co 1 history failed ==> status failed
      instance.rewardStatus =
        instance.notReceivedAmount.comparedTo(0) > 0
          ? REWARD_HISTORY_STATUS.FAILED
          : REWARD_HISTORY_STATUS.SUCCESS

      // neu da nhan thuong 1 lan thi la completed
      instance.completed = instance.receivedAmount.comparedTo(0) > 0 ? 1 : 0
    }
    return instance
  }
}
