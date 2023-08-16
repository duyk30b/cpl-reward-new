import { CampaignService, CAMPAIGN_TYPE } from '@libs/typeorm/campaign'
import { Mission, MissionService, MISSION_STATUS } from '@libs/typeorm/mission'
import { MissionEventService } from '@libs/typeorm/mission-event'
import { RewardAggregateService } from '@libs/typeorm/reward-aggregate'
import { RewardRuleService } from '@libs/typeorm/reward-rule'
import { Injectable } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { ErrorMessage } from '../common/error.enum'
import { FindMissionRequest } from './grpc-mission.request'

@Injectable()
export class GrpcMissionService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly missionEventService: MissionEventService,
    private readonly rewardAggregateService: RewardAggregateService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = Math.ceil(Date.now() / 1000)
    await this.missionService.updateStatusByTime(now)
  }

  async findManyBy(request: FindMissionRequest) {
    const missions = await this.missionService.findManyBy({ campaignId: request.campaignId })
    const rewardRules = await this.rewardRuleService.findManyBy({
      missionIds: missions.map((i) => i.id),
    })
    missions.forEach((i) => (i.rewardRules = rewardRules.filter((j) => j.missionId === i.id)))
    return missions
  }

  async findOneBy(request: { id: number }) {
    const mission = await this.missionService.findOneBy({ id: request.id })
    if (!mission) return {} as Mission
    mission.rewardRules = await this.rewardRuleService.findManyBy({ missionId: mission.id })
    return mission
  }

  async createOne(
    request: Mission,
  ): Promise<{ success?: boolean; message?: string; mission?: Mission }> {
    const campaign = await this.campaignService.findOneBy({ id: request.campaignId })

    if (campaign.type === CAMPAIGN_TYPE.DAILY) {
      request.closingDate = campaign.endDate
      request.openingDate = campaign.startDate
      // request.displayConditions = []
      // request.judgmentConditions = []
    }

    if (request.openingDate < campaign.startDate || request.closingDate > campaign.endDate) {
      return { success: false, message: ErrorMessage.INVALID_MISSION_TIME }
    }

    const existMissionPriority = await this.missionService.findOneBy({
      campaignId: request.campaignId,
      priority: request.priority,
    })
    if (existMissionPriority) {
      return { success: false, message: ErrorMessage.DUPLICATE_MISSION_PRIORITY }
    }

    // set status
    const now = Math.floor(Date.now() / 1000)
    if (now < request.openingDate) request.status = MISSION_STATUS.COMING_SOON
    if (request.openingDate <= now && now < request.closingDate) {
      request.status = MISSION_STATUS.RUNNING
    }
    if (request.closingDate < now) request.status = MISSION_STATUS.ENDED
    const mission = await this.missionService.insertOne(request)

    request.rewardRules.forEach((item) => {
      item.campaignId = mission.campaignId
      item.missionId = mission.id
      item.typeRule = 'mission'
    })
    mission.rewardRules = await this.rewardRuleService.insertMany(request.rewardRules)

    const eventName = request.judgmentConditions?.[0]?.eventName
    if (eventName) {
      await this.missionEventService.saveOne({
        eventName,
        missionId: mission.id,
        campaignId: mission.campaignId,
      })
    }

    return { success: true, mission }
  }

  async updateOne(
    request: Mission,
  ): Promise<{ success?: boolean; message?: string; mission?: Mission }> {
    const campaign = await this.campaignService.findOneBy({ id: request.campaignId })

    request.campaignType = campaign.type
    if (campaign.type === CAMPAIGN_TYPE.DAILY) {
      request.closingDate = campaign.endDate
      request.openingDate = campaign.startDate
      // request.displayConditions = []
      // request.judgmentConditions = []
    }

    if (request.openingDate < campaign.startDate || request.closingDate > campaign.endDate) {
      return { success: false, message: ErrorMessage.INVALID_MISSION_TIME }
    }

    const existMissionPriority = await this.missionService.findOneBy({
      id_notIn: [request.id],
      campaignId: request.campaignId,
      priority: request.priority,
    })
    if (existMissionPriority) {
      return { success: false, message: ErrorMessage.DUPLICATE_MISSION_PRIORITY }
    }

    request.eventName = request.judgmentConditions?.[0]?.eventName || ''
    await this.missionEventService.update(
      { missionId: request.id },
      { eventName: request.judgmentConditions?.[0]?.eventName || '' },
    )

    await Promise.all(
      request.rewardRules.map((item) => {
        delete item.releaseValue
        return this.rewardRuleService.update({ id: item.id }, item)
      }),
    )
    const rewardRules = await this.rewardRuleService.findManyBy({ missionId: request.id })

    const isOutOfBudget = await this.rewardAggregateService.checkOutOfBudgetMission(request.id)

    if (isOutOfBudget) {
      request.status = MISSION_STATUS.OUT_OF_BUDGET
      request.isOutOfBudget = true
    } else {
      request.isOutOfBudget = false
      const now = Math.floor(Date.now() / 1000)
      if (now < request.openingDate) request.status = MISSION_STATUS.COMING_SOON
      if (request.openingDate <= now && now < request.closingDate) {
        request.status = MISSION_STATUS.RUNNING
      }
      if (request.closingDate < now) request.status = MISSION_STATUS.ENDED
    }

    const updateResult = await this.missionService.update({ id: request.id }, request)
    if (updateResult.affected != 1) return { success: false, message: 'error database' }
    const mission = await this.missionService.findOneBy({ id: request.id })
    mission.rewardRules = rewardRules

    return { success: true, mission }
  }
}
