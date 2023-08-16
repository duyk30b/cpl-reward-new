import { Expose, instanceToInstance } from 'class-transformer'

export class RewardRule {
  @Expose({ name: 'id' })
  id: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'key' })
  key: string

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'limit_value' })
  limitValue: string

  @Expose({ name: 'release_value', toClassOnly: true })
  releaseValue: string

  @Expose({ name: 'created_at', toClassOnly: true })
  createdAt: number

  @Expose({ name: 'updated_at', toClassOnly: true })
  updatedAt: number

  static fromInstance(rewardRule: RewardRule): RewardRule {
    return instanceToInstance(rewardRule, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    })
  }

  static fromInstances(rewardRules: RewardRule[]): RewardRule[] {
    return instanceToInstance(rewardRules, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    })
  }
}
