import { Logger } from '@nestjs/common'
import { Command, CommandRunner } from 'nest-commander'
import { CampaignSeed } from './seed/campaign.seed'
import { MissionEventSeed } from './seed/mission-event.seed'
import { MissionSeed } from './seed/mission.seed'
import { RewardRuleSeed } from './seed/reward-rule.seed'

@Command({ name: 'seed:data' })
export class SeedDataService extends CommandRunner {
  private readonly logger = new Logger(SeedDataService.name)

  constructor(
    private readonly campaignSeed: CampaignSeed,
    private readonly missionSeed: MissionSeed,
    private readonly rewardRuleSeed: RewardRuleSeed,
    private readonly missionEventSeed: MissionEventSeed,
  ) {
    super()
  }

  async run(): Promise<void> {
    try {
      console.log('============= Start Seed data =============')
      console.log('Seed data only run in: ', process.env.ENV)
      if (process.env.ENV !== 'local') {
        return
      }
      console.time('[SUCCESS] - Congratulation, Fake data successfully')

      await this.campaignSeed.start(10)
      await this.missionSeed.createForEachCampaign(3)
      await this.rewardRuleSeed.createForEachMission()
      await this.missionEventSeed.createForEachMission()

      console.timeEnd('[SUCCESS] - Congratulation, Fake data successfully')
    } catch (error) {
      this.logger.error(error)
    } finally {
      process.exit()
    }
  }
}
