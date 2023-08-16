import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Between,
  FindConditions,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'
import { TARGET_USER } from '../common/enum'
import { PaginationDto } from '../common/pagination.dto'
import { CriteriaRewardHistory, IGetRewardEarnedFilter } from './reward-history.dto'
import { RewardHistory } from './reward-history.entity'
import { REWARD_HISTORY_STATUS } from './reward-history.enum'

@Injectable()
export class RewardHistoryService {
  constructor(
    @InjectRepository(RewardHistory)
    private rewardHistoryRepository: Repository<RewardHistory>,
  ) {}

  getWhereOptions(criteria: CriteriaRewardHistory): FindConditions<RewardHistory> {
    const where: FindConditions<RewardHistory> = {}

    if (criteria.id != null) where.id = criteria.id
    if (criteria.campaignId != null) where.campaignId = criteria.campaignId
    if (criteria.missionId != null) where.missionId = criteria.missionId
    if (criteria.userId != null) where.userId = criteria.userId
    if (criteria.status != null) where.status = criteria.status
    if (criteria.userType != null) where.userType = criteria.userType

    if (criteria.ids) {
      if (criteria.ids.length === 0) criteria.ids.push(0)
      where.id = In(criteria.ids)
    }
    if (criteria.missionIds) {
      if (criteria.missionIds.length === 0) criteria.missionIds.push(0)
      where.missionId = In(criteria.missionIds)
    }
    if (criteria.userIds) {
      if (criteria.userIds.length === 0) criteria.userIds.push('0')
      where.userId = In(criteria.userIds)
    }
    if (criteria.statuses?.length) where.status = In(criteria.statuses)

    if (criteria.fromTime != null && criteria.toTime != null) {
      where.createdAt = Between(criteria.fromTime, criteria.toTime)
    } else if (criteria.fromTime != null) {
      where.createdAt = MoreThanOrEqual(criteria.fromTime)
    } else if (criteria.toTime != null) {
      where.createdAt = LessThanOrEqual(criteria.toTime)
    }

    return where
  }

  async pagination(options: PaginationDto<RewardHistory>, criteria?: CriteriaRewardHistory) {
    const where = this.getWhereOptions(criteria)
    const { take, page, sortField, sortType, searchField, searchText } = options

    const [data, total] = await this.rewardHistoryRepository.findAndCount({
      where: {
        ...where,
        ...(searchField && searchText ? { [searchField]: Like(`%${searchText}%`) } : {}),
      },
      order: sortField && sortType ? { [sortField]: sortType } : { id: 'DESC' },
      take,
      skip: (page - 1) * take,
    })
    const totalPage = Math.ceil(total / take)

    return { total, page, take, data, totalPage }
  }

  async findOneBy(criteria: CriteriaRewardHistory): Promise<RewardHistory> {
    const where = this.getWhereOptions(criteria)
    return await this.rewardHistoryRepository.findOne({ where })
  }

  async findManyBy(
    criteria: CriteriaRewardHistory,
    order?: { [P in keyof RewardHistory]?: 'ASC' | 'DESC' },
  ): Promise<RewardHistory[]> {
    const where = this.getWhereOptions(criteria)

    const orderOptions: Record<string, 'ASC' | 'DESC'> = {}
    if (order?.createdAt !== undefined) orderOptions.createdAt = order.createdAt

    return await this.rewardHistoryRepository.find({
      where,
      order: orderOptions,
    })
  }

  async saveOne(dto: Partial<RewardHistory>): Promise<RewardHistory> {
    const instance = this.rewardHistoryRepository.create(dto)
    return await this.rewardHistoryRepository.save(instance)
  }

  async saveMany(dto: Partial<RewardHistory>[]): Promise<RewardHistory[]> {
    return await this.rewardHistoryRepository.save(dto)
  }

  async update(criteria: CriteriaRewardHistory, data: Partial<RewardHistory>) {
    const where = this.getWhereOptions(criteria)

    return await this.rewardHistoryRepository.update(where, data)
  }

  async count(criteria: CriteriaRewardHistory) {
    const where = this.getWhereOptions(criteria)

    return await this.rewardHistoryRepository.count({ where })
  }

  async getLastReward(criteria: CriteriaRewardHistory) {
    const where = this.getWhereOptions(criteria)

    return await this.rewardHistoryRepository.findOne({
      where,
      order: { createdAt: 'DESC' },
    })
  }

  async countUserMissionSuccess(criteria: {
    missionIds: number[]
    userId: string
  }): Promise<Record<number, { successCount: number }>> {
    let query = this.rewardHistoryRepository
      .createQueryBuilder('history')
      .select([
        'history.missionId AS missionId',
        'history.userId AS userId',
        'COUNT(*) AS successCount',
      ])
      .where('history.userId = :userId', { userId: criteria.userId })
      .andWhere('history.missionId IN (:...missionIds)', { missionIds: criteria.missionIds })
      .andWhere('history.userType = :userType', { userType: 'user' })
      .groupBy('history.missionId')
      .addGroupBy('history.userId')

    if (criteria.missionIds?.length) {
      query = query.andWhere('history.missionId IN (:...missionIds)', {
        missionIds: criteria.missionIds,
      })
    }

    const data = await query.getRawMany()
    return data.reduce((acc, cur: { missionId: number; successCount: number }) => {
      acc[cur.missionId] = { successCount: Number(cur.successCount) }
      return acc
    }, {} as Record<number, { successCount: number }>)
  }

  async getAffiliateEarned(userId: string) {
    const queryBuilder = this.rewardHistoryRepository.createQueryBuilder('history')
    queryBuilder.where('history.userId = :user_id', { user_id: userId })
    queryBuilder.andWhere('history.status = :status_type', {
      status_type: REWARD_HISTORY_STATUS.SUCCESS,
    })
    queryBuilder.andWhere('history.userType = :user_type', { user_type: TARGET_USER.REFERRAL_USER })
    queryBuilder.groupBy('history.currency')
    queryBuilder.select('history.currency')
    queryBuilder.addSelect('history.wallet')
    queryBuilder.addSelect('SUM (history.amount)', 'total_amount')
    return queryBuilder.getRawMany()
  }

  async getListRewardEarned(filter: IGetRewardEarnedFilter) {
    const { userId, wallets, fromTime, toTime } = filter
    const queryBuilder = this.rewardHistoryRepository.createQueryBuilder('history')
    queryBuilder.andWhere('history.status = :status_type', {
      status_type: REWARD_HISTORY_STATUS.SUCCESS,
    })

    queryBuilder.andWhere('history.userId = :userId', { userId })

    if (wallets?.length) {
      queryBuilder.andWhere('history.wallet IN (:...wallets)', { wallets })
    }
    if (fromTime) {
      queryBuilder.andWhere('history.createdAt >= :fromTime', { fromTime })
    }
    if (toTime) {
      queryBuilder.andWhere('history.createdAt <= :toTime', { toTime })
    }

    return await queryBuilder.getMany()
  }
}
