import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { FindConditions, In, Repository } from 'typeorm'
import { CriteriaRewardRule } from './reward-rule.dto'
import { RewardRule } from './reward-rule.entity'

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectRepository(RewardRule)
    private rewardRuleRepository: Repository<RewardRule>,
  ) {}

  getWhereOptions(criteria: CriteriaRewardRule): FindConditions<RewardRule> {
    const where: FindConditions<RewardRule> = {}

    if (criteria.missionId != null) where.missionId = criteria.missionId
    if (criteria.id != null) where.id = criteria.id

    if (criteria.missionIds) {
      if (criteria.missionIds.length === 0) criteria.missionIds.push(0)
      where.missionId = In(criteria.missionIds)
    }
    if (criteria.campaignIds) {
      if (criteria.campaignIds.length === 0) criteria.campaignIds.push(0)
      where.campaignId = In(criteria.campaignIds)
    }

    return where
  }

  async findManyBy(criteria: CriteriaRewardRule): Promise<RewardRule[]> {
    const where = this.getWhereOptions(criteria)

    return await this.rewardRuleRepository.find({ where })
  }

  async insertMany(dto: Partial<RewardRule>[]): Promise<RewardRule[]> {
    const instances: RewardRule[] = this.rewardRuleRepository.create(dto)
    return await this.rewardRuleRepository.save(instances)
  }

  async update(criteria: CriteriaRewardRule, dto: Partial<RewardRule>) {
    const where = this.getWhereOptions(criteria)

    return await this.rewardRuleRepository.update(where, dto)
  }

  async increaseReleaseValue(id: number, amount: BigNumber) {
    return await this.rewardRuleRepository
      .createQueryBuilder('reward_rule')
      .update(RewardRule)
      .where('id = :id', { id })
      .andWhere('(limitValue - releaseValue) >= :amount')
      .set({ releaseValue: () => `release_value + :amount` })
      .setParameters({ amount: amount.toNumber() })
      .execute()
  }
}
