import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindConditions,
  In,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm'
import { PaginationDto } from '../common/pagination.dto'
import { CriteriaCampaign } from './campaign.dto'
import { Campaign } from './campaign.entity'
import { CAMPAIGN_STATUS, CAMPAIGN_TYPE } from './campaign.enum'

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  getWhereOptions(criteria: CriteriaCampaign = {}): FindConditions<Campaign> {
    const where: FindConditions<Campaign> = {}

    if (criteria.id != null) where.id = criteria.id
    if (criteria.type != null) where.type = criteria.type
    if (criteria.isActive != null) where.isActive = criteria.isActive
    if (criteria.isHidden != null) where.isHidden = criteria.isHidden

    if (criteria.ids) {
      if (criteria.ids.length === 0) criteria.ids.push(0)
      where.id = In(criteria.ids)
    }

    if (criteria.id_notIn) {
      if (criteria.id_notIn.length === 0) criteria.id_notIn.push(0)
      where.id = Not(In(criteria.id_notIn))
    }

    if (criteria.activeTime != null) {
      where.startDate = LessThanOrEqual(criteria.activeTime)
      where.endDate = MoreThanOrEqual(criteria.activeTime)
    }
    return where
  }

  async findOneBy(criteria: CriteriaCampaign): Promise<Campaign> {
    const where = this.getWhereOptions(criteria)
    return await this.campaignRepository.findOne({ where })
  }

  async findManyBy(criteria: CriteriaCampaign): Promise<Campaign[]> {
    const where = this.getWhereOptions(criteria)
    return await this.campaignRepository.find({ where })
  }

  async insertOne(dto: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepository.create(dto)
    return this.campaignRepository.save(campaign)
  }

  async deleteBy(criteria: CriteriaCampaign) {
    const where = this.getWhereOptions(criteria)
    return await this.campaignRepository.delete(where)
  }

  async updateOne(criteria: CriteriaCampaign, dto: Partial<Campaign>) {
    const where = this.getWhereOptions(criteria)
    return this.campaignRepository.update(where, dto)
  }

  async updateStatusByTime(time: number) {
    await this.campaignRepository.update(
      { endDate: LessThanOrEqual(time) },
      { status: CAMPAIGN_STATUS.ENDED },
    )
    await this.campaignRepository.update(
      {
        startDate: LessThanOrEqual(time),
        endDate: MoreThan(time),
        status: Not(CAMPAIGN_STATUS.OUT_OF_BUDGET),
      },
      { status: CAMPAIGN_STATUS.RUNNING },
    )
  }

  async countBy(criteria: CriteriaCampaign) {
    const where = this.getWhereOptions(criteria)
    return await this.campaignRepository.count(where)
  }

  async pagination(options: PaginationDto<Campaign>, criteria?: CriteriaCampaign) {
    const where = this.getWhereOptions(criteria)
    const { take, page, sortField, sortType, searchField, searchText } = options

    const [data, total] = await this.campaignRepository.findAndCount({
      where: {
        ...where,
        ...(searchField && searchText ? { [searchField]: Like(`%${searchText}%`) } : {}),
      },
      order: sortField && sortType ? { [sortField]: sortType } : { priority: 'DESC', id: 'DESC' },
      take,
      skip: (page - 1) * take,
    })
    const totalPage = Math.ceil(total / take)

    return { total, page, take, data, totalPage }
  }

  async paginationForUser(options: PaginationDto<Campaign>, criteria: { campaignIds: number[] }) {
    if (criteria.campaignIds.length === 0) criteria.campaignIds.push(0)

    const { take, page, searchField, sortField, sortType, searchText } = options

    const [data, total] = await this.campaignRepository.findAndCount({
      where: [
        {
          type: CAMPAIGN_TYPE.DEFAULT,
          isActive: true,
          isHidden: false,
          ...(searchField && searchText ? { [searchField]: Like(`%${searchText}%`) } : {}),
          status: CAMPAIGN_STATUS.RUNNING,
        },
        {
          type: CAMPAIGN_TYPE.DEFAULT,
          isActive: true,
          isHidden: false,
          ...(searchField && searchText ? { [searchField]: Like(`%${searchText}%`) } : {}),
          id: In(criteria.campaignIds),
        },
      ],
      order: sortField && sortType ? { [sortField]: sortType } : { priority: 'DESC' },
      take,
      skip: (page - 1) * take,
    })
    const totalPage = Math.ceil(total / take)
    return { total, page, take, totalPage, data }
  }
}
