import { IdGeneratorService } from '@lib/id-generator'
import { Injectable } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { ExchangePriceService } from 'libs/exchange/grpc-services/price/exchange-price.service'
import { Campaign } from '../campaign/campaign.entity'
import { CAMPAIGN_TYPE } from '../campaign/campaign.enum'
import { CampaignService } from '../campaign/campaign.service'
import { DELIVERY_METHOD, TARGET_USER } from '../common/enum'
import { GrantTarget, GRANT_METHOD, Mission, MissionService, MISSION_STATUS } from '../mission'
import {
  IGetRewardEarnedFilter,
  RewardHistoryService,
  REWARD_HISTORY_STATUS,
} from '../reward-history'
import { RewardRule, RewardRuleService } from '../reward-rule'

@Injectable()
export class RewardAggregateService {
  constructor(
    private readonly missionService: MissionService,
    private readonly campaignService: CampaignService,
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly exchangePriceService: ExchangePriceService,
  ) {}

  async calcMissionDaily(options: {
    userId: string
    checkInTime: number
    canCheckIn?: boolean
  }): Promise<{ DONE: Mission[]; AVAILABLE?: Mission; NEXT: Mission[] }> {
    const { userId, checkInTime, canCheckIn } = options

    const campaign: Campaign = await this.campaignService.findOneBy({
      type: CAMPAIGN_TYPE.DAILY,
      isActive: true,
      activeTime: checkInTime,
    })
    if (!campaign) return { DONE: [], NEXT: [] }

    const missions = await this.missionService.findMany(
      {
        campaignId: campaign.id,
        isActive: true,
        statuses: [MISSION_STATUS.RUNNING, MISSION_STATUS.OUT_OF_BUDGET],
        activeTime: checkInTime,
      },
      { priority: 'DESC' },
    )
    if (missions.length == 0) return { DONE: [], NEXT: [] }

    const countReward = await this.rewardHistoryService.countUserMissionSuccess({
      missionIds: missions.map((i) => i.id),
      userId,
    })

    const missionsDone = []
    let missionAvailable: Mission
    const missionsNext = []

    missions.forEach((i) => {
      if (countReward[i.id]?.successCount >= 1) missionsDone.push(i)
      else if (canCheckIn && !missionAvailable) missionAvailable = i
      else missionsNext.push(i)
    })

    return {
      DONE: missionsDone,
      AVAILABLE: missionAvailable,
      NEXT: missionsNext,
    }
  }

  async increaseReleaseRewardRule(options: {
    referrerUserId: string
    mission: Mission
    data?: Record<string, any>
  }): Promise<{ success: boolean; error: string[] }> {
    const { mission, referrerUserId, data } = options
    const error = []

    const amountsByCurrency = mission.grantTarget.reduce((acc, cur: GrantTarget) => {
      const wc = `${cur.wallet}_${cur.currency}`
      if (cur.userType === TARGET_USER.REFERRAL_USER && referrerUserId === '0') return acc

      let { amount } = cur
      if (cur.grantMethod === GRANT_METHOD.PERCENT) {
        // data must be define in this case
        if (data[cur.property] == null) throw new Error(`Property ${cur.property} does not in data`)
        const value = new BigNumber(data[cur.property])
        amount = value.multipliedBy(amount).dividedBy(100)
      }
      acc[wc] = (acc[wc] || new BigNumber(0)).plus(amount)
      return acc
    }, {} as Record<string, BigNumber>)

    // check budget
    const rewardRules = await this.rewardRuleService.findManyBy({ missionId: options.mission.id })

    rewardRules.forEach((rewardRule) => {
      const { limitValue, releaseValue } = rewardRule
      const wc = `${rewardRule.wallet}_${rewardRule.currency}`
      const amount = amountsByCurrency[wc] || new BigNumber(0)
      const remain = limitValue.minus(releaseValue).minus(amount)

      if (remain.comparedTo(0) < 0) error.push('Out of Budget')
    })

    // nếu check không đủ tiền thì return error
    if (error.length > 0) {
      await this.missionService.update(
        { id: options.mission.id },
        {
          status: MISSION_STATUS.OUT_OF_BUDGET,
          isOutOfBudget: true,
        },
      )
      return { error, success: false }
    }

    for (let i = 0; i < rewardRules.length; i++) {
      const rewardRule: RewardRule = rewardRules[i]
      const amount = amountsByCurrency[`${rewardRule.wallet}_${rewardRule.currency}`]
      if (!amount) continue
      const update = await this.rewardRuleService.increaseReleaseValue(rewardRule.id, amount)
      if (update.affected === 0) {
        error.push('Out of Budget')
        break
      }
    }

    if (error.length > 0) {
      await this.missionService.update(
        { id: options.mission.id },
        {
          status: MISSION_STATUS.OUT_OF_BUDGET,
          isOutOfBudget: true,
        },
      )
      return { error, success: false }
    }

    return { error: [], success: true }
  }

  async createRewardHistory(options: {
    missionId: number
    userId: string
    referrerUserId: string
    data?: Record<string, any>
  }) {
    const result: { userId: string; userRewardHistoryId: number; tagIds: number[] }[] = []

    const mission = await this.missionService.findOneBy({ id: options.missionId })

    for (let i = 0; i < mission.grantTarget.length; i++) {
      const target = mission.grantTarget[i]
      const userId = target.userType === TARGET_USER.USER ? options.userId : options.referrerUserId
      let { amount } = target
      if (target.grantMethod === GRANT_METHOD.PERCENT) {
        const value = new BigNumber(options.data[target.property])
        amount = value.multipliedBy(amount).dividedBy(100)
      }

      if (userId === '0') continue

      const history = await this.rewardHistoryService.saveOne({
        campaignId: mission.campaignId,
        missionId: mission.id,
        userId,
        userType: target.userType,
        amount,
        currency: target.currency,
        wallet: target.wallet,
        deliveryMethod: DELIVERY_METHOD.AUTO,
        referrerUserId: options.referrerUserId,
        referenceId: this.idGeneratorService.generateSnowflakeId(),
        status: REWARD_HISTORY_STATUS.PENDING,
      })
      result.push({
        userId: history.userId,
        userRewardHistoryId: history.id,
        tagIds: target.tagIds,
      })
    }

    return result
  }

  async checkOutOfBudgetMission(missionId: number): Promise<boolean> {
    const mission = await this.missionService.findOneBy({ id: missionId })

    const amountsByCurrency = mission.grantTarget.reduce((acc, cur: GrantTarget) => {
      const wc = `${cur.wallet}_${cur.currency}`
      // trường hợp phát thường theo % thì không biết amount là bao nhiêu nên không thể cộng vào được
      if (cur.grantMethod === GRANT_METHOD.FIXED) {
        acc[wc] = (acc[wc] || new BigNumber(0)).plus(cur.amount)
      }
      return acc
    }, {} as Record<string, BigNumber>)

    let isOutOfBudget = false
    const rewardRules = await this.rewardRuleService.findManyBy({ missionId })
    rewardRules.forEach((rewardRule) => {
      const { limitValue, releaseValue, wallet, currency } = rewardRule
      const wc = `${wallet}_${currency}`
      const amount = amountsByCurrency[wc] || new BigNumber(0)
      const remain = limitValue.minus(releaseValue).minus(amount)

      if (releaseValue.comparedTo(0) > 0) {
        if (remain.comparedTo(0) <= 0) isOutOfBudget = true
      }
    })
    return isOutOfBudget
  }

  async getTotalRewardEarnedByCurrency(filter: IGetRewardEarnedFilter, currency?: string) {
    if (!currency) currency = 'usdt'
    currency = currency.toLowerCase()
    const rewards = await this.rewardHistoryService.getListRewardEarned(filter)
    if (!rewards?.length) return '0'
    const coins = [
      ...new Set(
        rewards.map((reward) => reward.currency.toLowerCase()).filter((e) => !!e && e != currency),
      ),
    ]
    const pairs = coins.map((coin) => `${coin}/${currency}`)
    const pairPricesResponse = await this.exchangePriceService.getPrice({ pairs })
    const pairPrices = pairPricesResponse.data.reduce(
      (acc, cur) => {
        acc[cur.coin] = cur.price
        return acc
      },
      { [currency]: '1' },
    )
    return rewards
      .reduce((acc, cur) => {
        return acc.plus(
          new BigNumber(cur.amount).multipliedBy(
            new BigNumber(pairPrices[cur.currency.toLowerCase()]),
          ),
        )
      }, new BigNumber(0))
      .toString()
  }
}
