import { IFilterMission } from '@lib/redis'
import { CAMPAIGN_TYPE, CampaignService } from '@libs/typeorm/campaign'
import { MISSION_STATUS, Mission, MissionService } from '@libs/typeorm/mission'
import { MissionEventService } from '@libs/typeorm/mission-event'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WorkerFilterMissionService {
  private readonly logger = new Logger(WorkerFilterMissionService.name)

  constructor(
    private readonly missionEventService: MissionEventService,
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly rewardHistoryService: RewardHistoryService,
  ) { }

  async findMissionAvailable(data: IFilterMission): Promise<Mission[]> {
    const missionEventList = await this.missionEventService.findByEventName(data.eventName)

    let campaignIds = missionEventList.map((i) => i.campaignId)
    campaignIds = Array.from(new Set(campaignIds))
    const campaignsRunning = await this.campaignService.findManyBy({
      type: CAMPAIGN_TYPE.DEFAULT,
      isActive: true,
      ids: campaignIds,
      activeTime: data.createTime,
    })
    campaignIds = campaignsRunning.map((i) => i.id)
    if (campaignIds.length === 0) {
      this.logger.log(`[${data.messageId}] -- No campaign found by event ${data.eventName}`)
      return []
    }

    let missionIds = missionEventList.map((i) => i.missionId)
    missionIds = Array.from(new Set(missionIds))
    const missionsRunning = await this.missionService.findManyBy({
      campaignIds,
      ids: missionIds,
      isActive: true,
      status: MISSION_STATUS.RUNNING,
      activeTime: data.createTime,
    })
    missionIds = missionsRunning.map((i) => i.id)
    if (missionIds.length === 0) {
      this.logger.log(`[${data.messageId}] -- No Mission found by event ${data.eventName}`)
      return []
    }

    const countReward = await this.rewardHistoryService.countUserMissionSuccess({
      userId: data.userId,
      missionIds,
    })

    return missionsRunning.filter((i) => {
      const successCount = countReward[i.id]?.successCount || 0
      return successCount < i.limitReceivedReward
    })
  }
}
