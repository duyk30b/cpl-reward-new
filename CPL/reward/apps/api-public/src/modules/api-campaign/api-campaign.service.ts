import { UserService } from '@app/grpc-client'
import { canCheckInDaily } from '@lib/common'
import { BullQueueService } from '@lib/redis'
import { RedisLockService } from '@lib/redis/cache'
import { CheckUserConditionService } from '@libs/check-user-condition'
import {
  CAMPAIGN_TYPE,
  CampaignService,
  SearchFieldCampaign,
  SortFieldCampaign
} from '@libs/typeorm/campaign'
import { CheckInLogService } from '@libs/typeorm/checkin-log'
import {
  MISSION_STATUS,
  Mission,
  MissionService,
  checkJudgmentConditions,
} from '@libs/typeorm/mission'
import { RewardAggregateService } from '@libs/typeorm/reward-aggregate/reward-aggregate.service'
import { RewardHistoryService } from '@libs/typeorm/reward-history'
import { ConflictException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PaginationCampaignRequest } from './request/pagination-campaign.request'
import { CampaignCheckin } from './response/campaign-checkin.response'
import { CLAIM_STATUS, MissionCheckin } from './response/mission-checkin.response'

@Injectable()
export class ApiCampaignService {
  private readonly logger = new Logger(ApiCampaignService.name)

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly redisLockService: RedisLockService,
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly checkInLogService: CheckInLogService,
    private readonly campaignAggregateService: RewardAggregateService,
    private readonly checkUserConditionService: CheckUserConditionService,
    private readonly userService: UserService,
  ) { }

  async paginationCampaignDefault(request: PaginationCampaignRequest, userId: string) {
    const rewards = await this.rewardHistoryService.findManyBy({ userId })
    const missionsActive = await this.missionService.findManyBy({
      ids: rewards.map((i) => i.missionId),
      isActive: true,
    })

    const { total, page, take, totalPage, data } = await this.campaignService.paginationForUser(
      {
        take: request.limit,
        page: request.page,
        searchField: SearchFieldCampaign[request.searchField],
        searchText: request.searchText,
        sortField: SortFieldCampaign[request.sortField],
        sortType: request.sortType,
      },
      { campaignIds: missionsActive.map((item) => item.campaignId) },
    )

    return {
      data,
      pagination: { total, page, size: take },
      links: {
        first: `/campaigns?limit=${take}`,
        last: `/campaigns?page=${totalPage}&limit=${take}`,
        prev: page > 1 ? `/campaigns?page=${page - 1}&limit=${take}` : '',
        next: page < totalPage ? `/campaigns?page=${page + 1}&limit=${take}` : '',
      },
    }
  }

  async findOneById(id: number) {
    const campaign = await this.campaignService.findOneBy({
      id,
      isActive: true,
      type: CAMPAIGN_TYPE.DEFAULT,
    })
    if (!campaign) throw new HttpException('Campaign was not found!', HttpStatus.NOT_FOUND)
    return campaign
  }

  async getCheckInCampaign(userId: string) {
    const userResolver = this.checkUserConditionService.getUserResolver(userId)

    const now = Math.floor(Date.now() / 1000)
    const campaign = await this.campaignService.findOneBy({
      type: CAMPAIGN_TYPE.DAILY,
      isActive: true,
      activeTime: now,
    })
    if (!campaign) return { campaign: null, missions: [] }

    const checkInLog = await this.checkInLogService.findOneBy({ userId, campaignId: campaign.id })
    const canCheckIn = canCheckInDaily(now, checkInLog?.lastCheckIn || 0, campaign.resetTime)

    const missionsMap = await this.campaignAggregateService.calcMissionDaily({
      userId,
      checkInTime: now,
      canCheckIn,
    })

    const missionsDone: MissionCheckin[] = []
    const missionsAvail: MissionCheckin[] = []
    const missionsNext: MissionCheckin[] = []

    for (let i = 0; i < missionsMap.DONE.length; i++) {
      if (missionsMap.DONE[i].displayConditions) {
        const checkUser = await userResolver.checkUserConditions(
          missionsMap.DONE[i].displayConditions,
        )
        if (!checkUser.pass) continue
      }
      missionsDone.push(MissionCheckin.fromMission(missionsMap.DONE[i]))
    }

    if (missionsMap.AVAILABLE) {
      if (missionsMap.AVAILABLE.displayConditions) {
        const checkUser = await userResolver.checkUserConditions(
          missionsMap.AVAILABLE.displayConditions,
        )
        if (checkUser.pass) missionsAvail.push(MissionCheckin.fromMission(missionsMap.AVAILABLE))
      } else {
        missionsAvail.push(MissionCheckin.fromMission(missionsMap.AVAILABLE))
      }
    }

    for (let i = 0; i < missionsMap.NEXT.length; i++) {
      if (missionsMap.NEXT[i].displayConditions) {
        const checkUser = await userResolver.checkUserConditions(
          missionsMap.NEXT[i].displayConditions,
        )
        if (!checkUser.pass) continue
      }
      missionsNext.push(MissionCheckin.fromMission(missionsMap.NEXT[i]))
    }

    missionsDone.forEach((i) => (i.claimStatus = CLAIM_STATUS.DONE))
    missionsAvail.forEach((i) => (i.claimStatus = CLAIM_STATUS.AVAIL))
    missionsNext.forEach((i) => (i.claimStatus = CLAIM_STATUS.NEXT))

    const campaignCheckIn = CampaignCheckin.fromCampaign(campaign)
    const findMissionRunning = missionsAvail.find((i) => {
      return i.status === MISSION_STATUS.RUNNING
    })
    if (
      findMissionRunning &&
      Number(campaignCheckIn.resetTime) - 24 * 60 * 60 >= (checkInLog?.lastIgnoreDisplay || 0)
    ) {
      campaignCheckIn.shouldShowPopup = true
    } else {
      campaignCheckIn.shouldShowPopup = false
    }

    const result = {
      campaign: campaignCheckIn,
      missions: [...missionsDone, ...missionsAvail, ...missionsNext],
    }

    if (!result.missions.length) return { campaign: null, missions: [] }

    return result
  }

  async startCheckIn(userId: string) {
    const lock = await this.redisLockService
      .acquire([`checkIn:${userId}`], 3000, {
        retryCount: 10,
        retryDelay: 500,
        retryJitter: 200,
      })
      .catch((e) => {
        this.logger.warn(e)
        throw new ConflictException()
      })

    try {
      const checkInTime = Math.floor(Date.now() / 1000)
      const user = await this.userService.findById(userId)
      if (!user) {
        this.logger.log(`UserId: ${userId} does not exists`)
        return null
      }
      const mission = await this.getMissionCanCheckIn(userId, checkInTime)
      if (!mission) return null

      const checkConditions = await this.checkConditions(mission, userId, checkInTime)
      if (!checkConditions) return null

      const increaseRelease = await this.campaignAggregateService.increaseReleaseRewardRule({
        referrerUserId: user.referredById || '0',
        mission,
      })
      if (increaseRelease.error.length > 0) return null

      // khi mọi điều kiện thoả mãn. Tạo bản ghi checkInLog và RewardHistory, sau đó sendReward bằng Queue
      await this.checkInLogService.upsertLastCheckIn({
        userId,
        campaignId: mission.campaignId,
        lastCheckIn: checkInTime,
        lastIgnoreDisplay: checkInTime,
      })

      const rewardsInfo = await this.campaignAggregateService.createRewardHistory({
        missionId: mission.id,
        userId,
        referrerUserId: user.referredById,
      })

      rewardsInfo.forEach((item) => {
        this.bullQueueService.addSendReward({
          userId: item.userId,
          messageId: `UserId: ${userId} CampaignId: ${mission.campaignId} - checkin by API`,
          userRewardHistoryId: item.userRewardHistoryId,
          tagIds: item.tagIds,
        })
      })

      const missionCheckin = MissionCheckin.fromMission(mission)
      missionCheckin.claimStatus = CLAIM_STATUS.DONE

      return missionCheckin
    } catch (error) {
      this.logger.log(error)
    } finally {
      await lock.release()
    }
  }

  async getMissionCanCheckIn(userId: string, checkInTime: number): Promise<Mission> {
    const campaign = await this.campaignService.findOneBy({
      type: CAMPAIGN_TYPE.DAILY,
      isActive: true,
      activeTime: checkInTime,
    })
    if (!campaign) return null

    const checkInLog = await this.checkInLogService.findOneBy({
      userId,
      campaignId: campaign.id,
    })

    const canCheckIn = canCheckInDaily(
      checkInTime,
      checkInLog?.lastCheckIn || 0,
      campaign.resetTime,
    )
    if (!canCheckIn) return null

    const missionsMap = await this.campaignAggregateService.calcMissionDaily({
      userId,
      checkInTime,
      canCheckIn,
    })
    const mission = missionsMap.AVAILABLE
    if (!mission || mission.status === MISSION_STATUS.OUT_OF_BUDGET) return null

    return mission
  }

  async checkConditions(mission: Mission, userId: string, checkInTime: number): Promise<boolean> {
    const checkJudgment = await checkJudgmentConditions(
      { userId, createdAt: checkInTime, eventName: 'reward_user_check_in' },
      mission.judgmentConditions,
    )
    if (!checkJudgment.pass) return false

    const checkUser = await this.checkUserConditionService.checkUserConditions(
      userId,
      mission.userConditions,
    )
    if (!checkUser.pass) return false

    return true
  }

  async ignoreCheckInCampaignDisplay(userId: string) {
    const now = Math.floor(Date.now() / 1000)
    const campaign = await this.campaignService.findOneBy({
      type: CAMPAIGN_TYPE.DAILY,
      isActive: true,
      activeTime: now,
    })
    if (!campaign) return false

    await this.checkInLogService.upsertLastIgnoreCheckIn({
      userId,
      campaignId: campaign.id,
      lastIgnoreDisplay: now,
    })

    return true
  }
}
