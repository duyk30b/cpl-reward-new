import { NewBalanceService } from '@libs/new-balance'
import { BalanceType } from '@libs/new-balance/grpc-services/transaction/transaction.enum'
import {
  Campaign,
  CampaignService,
  CAMPAIGN_TYPE,
  SearchFieldCampaign,
  SortFieldCampaign,
} from '@libs/typeorm/campaign'
import { WALLET } from '@libs/typeorm/common/enum'
import { MissionService } from '@libs/typeorm/mission'
import {
  RewardHistoryService,
  REWARD_HISTORY_STATUS,
  SortFieldRewardHistory,
} from '@libs/typeorm/reward-history'
import { RewardRuleService } from '@libs/typeorm/reward-rule'
import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { ExchangePriceService } from 'libs/exchange/grpc-services/price/exchange-price.service'
import { ErrorMessage } from '../common/error.enum'
import {
  CountMissingRewardHistoryRequest,
  PaginationCampaignRequest,
  PaginationRewardHistoryRequest,
} from './grpc-campaign.request'

@Injectable()
export class GrpcCampaignService {
  private readonly logger = new Logger(GrpcCampaignService.name)

  constructor(
    private readonly campaignService: CampaignService,
    private readonly missionService: MissionService,
    private readonly rewardRuleService: RewardRuleService,
    private readonly rewardHistoryService: RewardHistoryService,
    private readonly exchangePriceService: ExchangePriceService,
    private readonly newBalanceService: NewBalanceService,
  ) {}

  @Interval(5000)
  async handleIntervalUpdateStatus() {
    const now = Math.ceil(Date.now() / 1000)
    await this.campaignService.updateStatusByTime(now)
  }

  async findOneBy(request: { id: number }) {
    const campaign = await this.campaignService.findOneBy({ id: request.id })
    return campaign || {}
  }

  async insertOne(request: Campaign) {
    if (request.type === CAMPAIGN_TYPE.DAILY && request.isActive) {
      const countOtherDaily = await this.campaignService.countBy({
        type: CAMPAIGN_TYPE.DAILY,
        isActive: true,
      })
      if (countOtherDaily > 0) return {}
    }
    return this.campaignService.insertOne(request)
  }

  async deleteBy(request: { id: number }): Promise<{ affected: number }> {
    const { affected } = await this.campaignService.deleteBy({ id: request.id })
    return { affected }
  }

  async update(request: Campaign) {
    if (request.type === CAMPAIGN_TYPE.DAILY) {
      return this.updateCampaignDaily(request)
    }
    return this.updateCampaignDefault(request)
  }

  async updateCampaignDaily(
    request: Campaign,
  ): Promise<{ message?: string; success?: boolean; campaign?: Campaign }> {
    if (request.isActive) {
      const countOtherDaily = await this.campaignService.countBy({
        id_notIn: [request.id],
        type: CAMPAIGN_TYPE.DAILY,
        isActive: true,
      })
      if (countOtherDaily > 0) {
        return { success: false, message: ErrorMessage.INVALID_CAMPAIGN_TYPE }
      }
    }

    const originCampaign = await this.campaignService.findOneBy({ id: request.id })

    const updateResult = await this.campaignService.updateOne(
      { id: request.id, type: CAMPAIGN_TYPE.DAILY },
      request,
    )
    if (updateResult.affected === 0) return { success: false, message: ErrorMessage.UNKNOWN }

    const newCampaign = await this.campaignService.findOneBy({ id: request.id })
    if (
      newCampaign.startDate !== originCampaign.startDate ||
      newCampaign.endDate !== originCampaign.endDate
    ) {
      await this.missionService.update(
        { campaignId: newCampaign.id },
        {
          openingDate: newCampaign.startDate,
          closingDate: newCampaign.endDate,
        },
      )
    }
    return { success: true, campaign: newCampaign }
  }

  async updateCampaignDefault(
    request: Campaign,
  ): Promise<{ message?: string; success?: boolean; campaign?: Campaign }> {
    const missions = await this.missionService.findManyBy({ campaignId: request.id })
    for (let i = 0; i < missions.length; i++) {
      const { openingDate, closingDate } = missions[i]
      if (request.startDate > openingDate || request.endDate < closingDate) {
        return { success: false, message: ErrorMessage.INVALID_CAMPAIGN_TIME }
      }
    }
    const updateResult = await this.campaignService.updateOne(
      { id: request.id, type: CAMPAIGN_TYPE.DEFAULT },
      request,
    )
    if (updateResult.affected === 0) return { success: false, message: ErrorMessage.UNKNOWN }

    const campaign = await this.campaignService.findOneBy({ id: request.id })
    return { success: true, campaign }
  }

  async paginationCampaign(request: PaginationCampaignRequest) {
    const { total, page, take, totalPage, data } = await this.campaignService.pagination({
      page: request.page,
      take: request.limit,
      searchField: SearchFieldCampaign[request.searchField],
      searchText: request.searchText,
      sortField: SortFieldCampaign[request.sortField],
      sortType: request.sortType,
    })

    // get reward rule for each campaign
    const campaignIds = data.map((i) => i.id)
    const rewardRules = await this.rewardRuleService.findManyBy({ campaignIds })
    data.forEach((campaign) => {
      campaign.rewardRules = rewardRules.filter((rule) => campaign.id === rule.campaignId)
    })

    // get currency and price
    let currencies = rewardRules.map((rule) => rule.currency)
    currencies = Array.from(new Set([...currencies, 'USDT']))

    const queryPrice = currencies.map((currency) => {
      return this.exchangePriceService.getPrice({ pairs: [`${currency}/usdt`] })
    })
    let queryPriceResult = await Promise.allSettled(queryPrice)
    queryPriceResult = queryPriceResult.filter((item) => item.status === 'fulfilled')

    const prices = (queryPriceResult as any[]).map((res) => ({
      currency: res?.value?.data[0]?.coin?.toUpperCase(),
      price: res?.value?.data[0]?.price,
    }))

    return {
      data,
      pagination: { total, page, size: take },
      links: {
        first: `/campaigns?limit=${take}`,
        last: `/campaigns?page=${totalPage}&limit=${take}`,
        prev: page > 1 ? `/campaigns?page=${page - 1}&limit=${take}` : '',
        next: page < totalPage ? `/campaigns?page=${page + 1}&limit=${take}` : '',
      },
      prices,
    }
  }

  async paginationMissingReward(request: PaginationRewardHistoryRequest) {
    const result = await this.rewardHistoryService.pagination(
      {
        page: request.page,
        take: request.limit,
        sortField: SortFieldRewardHistory[request.sortField],
        sortType: request.sortType,
      },
      {
        status: REWARD_HISTORY_STATUS.FAILED,
      },
    )
    return {
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        size: result.take,
      },
    }
  }

  async countMissingReward(request: CountMissingRewardHistoryRequest) {
    return await this.rewardHistoryService.count({
      status: REWARD_HISTORY_STATUS.FAILED,
      fromTime: request.fromTime,
      toTime: request.toTime,
    })
  }

  async retryRewardHistory(id: number) {
    const history = await this.rewardHistoryService.findOneBy({ id })
    if (history.status !== REWARD_HISTORY_STATUS.FAILED) return { success: false }

    await this.rewardHistoryService.update(
      { id: history.id },
      { status: REWARD_HISTORY_STATUS.PENDING },
    )

    this.logger.log(`Start retry reward history - id: ${history.id}`)

    try {
      const { balanceTransactionId } = await this.newBalanceService.startSendReward({
        userId: history.userId,
        amount: history.amount.toString(10),
        currency: history.currency.toLowerCase(),
        referenceId: history.referenceId,
        balance: BalanceType[WALLET[history.wallet]],
      })

      this.logger.log(
        `Send Reward success, rewardHistoryId: ${history.id}, balanceTransactionId: ${balanceTransactionId}`,
      )

      await this.rewardHistoryService.update(
        { id: history.id },
        {
          status: REWARD_HISTORY_STATUS.SUCCESS,
          balanceResponse: JSON.stringify({ balanceTransactionId }),
        },
      )
    } catch (error) {
      this.logger.log(error)
      await this.rewardHistoryService.update(
        { id: history.id },
        {
          status: REWARD_HISTORY_STATUS.FAILED,
          balanceResponse: error.message,
        },
      )
      return { success: false }
    }

    return { success: true }
  }
}
