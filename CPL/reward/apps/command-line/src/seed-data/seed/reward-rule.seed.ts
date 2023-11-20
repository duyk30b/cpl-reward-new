import { WALLET } from '@libs/typeorm/common/enum'
import { Mission } from '@libs/typeorm/mission'
import { RewardRule } from '@libs/typeorm/reward-rule'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { Repository } from 'typeorm'

@Injectable()
export class RewardRuleSeed {
  constructor(
    @InjectRepository(Mission) private readonly missionRepository: Repository<Mission>,
    @InjectRepository(RewardRule) private readonly rewardRuleRepository: Repository<RewardRule>,
  ) {}

  async createForEachMission() {
    const missions = await this.missionRepository.find()

    const rewardRulesDto: RewardRule[] = []
    for (let i = 0; i < missions.length; i++) {
      const rewardRuleReward = new RewardRule()
      rewardRuleReward.campaignId = missions[i].campaignId
      rewardRuleReward.missionId = missions[i].id
      rewardRuleReward.wallet = WALLET.REWARD
      rewardRuleReward.typeRule = 'mission'
      rewardRuleReward.limitValue = new BigNumber(0)
      rewardRuleReward.releaseValue = new BigNumber(0)

      const rewardRuleCashback = new RewardRule()
      rewardRuleCashback.campaignId = missions[i].campaignId
      rewardRuleCashback.missionId = missions[i].id
      rewardRuleCashback.wallet = WALLET.CASHBACK
      rewardRuleCashback.typeRule = 'mission'
      rewardRuleCashback.limitValue = new BigNumber(10000)
      rewardRuleCashback.releaseValue = new BigNumber(0)

      const rewardRuleExchange = new RewardRule()
      rewardRuleExchange.campaignId = missions[i].campaignId
      rewardRuleExchange.missionId = missions[i].id
      rewardRuleExchange.wallet = WALLET.EXCHANGE
      rewardRuleExchange.typeRule = 'mission'
      rewardRuleExchange.limitValue = new BigNumber(0)
      rewardRuleExchange.releaseValue = new BigNumber(0)

      rewardRulesDto.push(rewardRuleReward)
      rewardRulesDto.push(rewardRuleCashback)
      rewardRulesDto.push(rewardRuleExchange)
    }

    await this.rewardRuleRepository.save(rewardRulesDto)
  }
}
