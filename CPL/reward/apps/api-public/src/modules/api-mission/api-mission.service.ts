import { CheckUserConditionService } from '@libs/check-user-condition'
import { CampaignService, CAMPAIGN_TYPE } from '@libs/typeorm/campaign'
import { TARGET_USER } from '@libs/typeorm/common/enum'
import { MissionService, MISSION_STATUS, TARGET_TYPE } from '@libs/typeorm/mission'
import {
  RewardHistoryService,
  REWARD_HISTORY_STATUS,
  SortFieldRewardHistory,
} from '@libs/typeorm/reward-history'
import { Injectable, Logger } from '@nestjs/common'
import { PaginationMissionRequest } from './request/pagination-mission.request'
import { PaginationRewardHistoryRequest } from './request/pagination-reward-history.request'
import { MissionResponse } from './response/mission.response'
import { RewardHistoryResponse } from './response/reward-history.response'

@Injectable()
export class ApiMissionService {
  private readonly logger = new Logger(ApiMissionService.name)

  constructor(
    private readonly missionService: MissionService,
    private readonly campaignService: CampaignService,
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly checkUserConditionService: CheckUserConditionService,
  ) { }

  async paginationMission(request: PaginationMissionRequest, userId: string) {
    const { page, limit } = request

    const userResolver = this.checkUserConditionService.getUserResolver(userId)

    let campaignIds = []
    if (request.campaignId) campaignIds.push(request.campaignId)
    else {
      const campaigns = await this.campaignService.findManyBy({
        type: CAMPAIGN_TYPE.DEFAULT,
        isActive: true,
        isHidden: false,
      })
      campaignIds = campaigns.map((i) => i.id)
    }

    const rewards = await this.rewardHistoryService.findManyBy({
      userId,
      userType: TARGET_USER.USER,
    })
    const rewardIdsHasComplete = rewards
      .filter((i) => i.status === REWARD_HISTORY_STATUS.SUCCESS)
      .map((i) => i.id)
    const rewardHistories = rewards.filter((i) => rewardIdsHasComplete.includes(i.id))
    const missionIdsComplete = Array.from(new Set(rewardHistories.map((i) => i.missionId)))

    const getMissionsAvail = this.missionService.findMany(
      {
        id_notIn: missionIdsComplete,
        isActive: true,
        campaignIds,
        status: MISSION_STATUS.RUNNING,
        targetTypes: [TARGET_TYPE.HYBRID, TARGET_TYPE.ONLY_MAIN],
      },
      { priority: 'DESC', id: 'ASC' },
    )
    const getMissionsComplete = this.missionService.findMany(
      {
        ids: missionIdsComplete,
        isActive: true,
        campaignIds,
      },
      { priority: 'DESC', id: 'ASC' },
    )

    const missions = [...(await getMissionsAvail), ...(await getMissionsComplete)]

    const data: MissionResponse[] = []
    for (let i = 0; i < missions.length; i++) {
      const checkUser = await userResolver.checkUserConditions(missions[i].displayConditions)
      if (!checkUser.pass) continue

      const missionResponse = MissionResponse.fromMissionAndHistory(missions[i], rewardHistories)
      data.push(missionResponse)
    }

    const totalPage = Math.ceil(data.length / request.limit)

    return {
      data: data.slice((page - 1) * limit, page * limit),
      links: {
        prev: page > 1 ? `from_id=${page - 1}&limit=${limit}` : '',
        next: page < totalPage ? `from_id=${page + 1}&limit=${limit}` : '',
      },
      total: data.length,
      page,
      limit,
    }
  }

  async getAffiliateEarned(userId: string) {
    return await this.rewardHistoryService.getAffiliateEarned(userId)
  }

  async getAffiliateHistoryDetail(request: PaginationRewardHistoryRequest, userId: string) {
    const { total, page, take, data } = await this.rewardHistoryService.pagination(
      {
        page: request.page,
        take: request.limit,
        sortField: SortFieldRewardHistory[request.sortField],
        sortType: request.sortType,
      },
      {
        userId,
        userType: TARGET_USER.REFERRAL_USER,
      },
    )
    return {
      data: RewardHistoryResponse.fromRewardHistories(data),
      pagination: { page, total, size: take }
    }
  }

  public async requestRedeemMission(missionId: number, userId: string) {
    return 'Waiting...' + userId
  }
}
