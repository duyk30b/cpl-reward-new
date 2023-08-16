import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RewardRule } from '@lib/reward-rule/entities/reward-rule.entity'
import { CreateRewardRuleDto } from '@lib/reward-rule/dto/create-reward-rule.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateRewardRuleDto } from '@lib/reward-rule/dto/update-reward-rule.dto'
import { OptionalRewardRule } from '@lib/reward-rule/reward-rule.interface'
import { FixedNumber } from 'ethers'

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectRepository(RewardRule)
    private rewardRuleRepository: Repository<RewardRule>,
  ) {}

  async create(
    createRewardRule: CreateRewardRuleDto,
    optionalRewardRule: OptionalRewardRule,
  ): Promise<RewardRule> {
    createRewardRule.campaignId = optionalRewardRule.campaignId
    createRewardRule.missionId = optionalRewardRule.missionId
    createRewardRule.typeRule = optionalRewardRule.typeRule

    const rewardRuleEntity = plainToInstance(RewardRule, createRewardRule, {
      ignoreDecorators: true,
    })
    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async update(
    updateRewardRuleDto: UpdateRewardRuleDto,
    optionalRewardRule: OptionalRewardRule,
  ): Promise<RewardRule> {
    updateRewardRuleDto.campaignId = optionalRewardRule.campaignId
    updateRewardRuleDto.missionId = optionalRewardRule.missionId
    updateRewardRuleDto.typeRule = optionalRewardRule.typeRule

    const rewardRuleEntity = plainToInstance(RewardRule, updateRewardRuleDto, {
      ignoreDecorators: true,
    })

    return await this.rewardRuleRepository.save(rewardRuleEntity)
  }

  async find(conditions: any): Promise<RewardRule[]> {
    return await this.rewardRuleRepository.find(conditions)
  }

  async findOne(conditions: any): Promise<RewardRule> {
    return await this.rewardRuleRepository.findOne(conditions)
  }

  async safeIncreaseReleaseValue(rewardRuleId: number, increaseAmount: string) {
    // Transaction here.
    //const currentRewardRule = await this.findOne({ id: rewardRuleId })

    const fixedIncreaseAmount = FixedNumber.fromString(increaseAmount)
    // const newReleaseValue = FixedNumber.from(currentRewardRule.releaseValue)
    //   .addUnsafe(fixedIncreaseAmount)
    //   .toUnsafeFloat()

    return await this.rewardRuleRepository
      .createQueryBuilder('reward_rule')
      .update(RewardRule)
      .where('id = :id', { id: rewardRuleId })
      .andWhere('(limitValue - releaseValue) >= :amount')
      .set({
        releaseValue: () => `release_value + :amount`,
      })
      .setParameters({ amount: fixedIncreaseAmount.toUnsafeFloat() })
      .execute()
  }

  async onlyUpdate(updateRewardRule: RewardRule): Promise<RewardRule> {
    return await this.rewardRuleRepository.save(updateRewardRule)
  }
}
