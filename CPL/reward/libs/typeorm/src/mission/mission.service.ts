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
import { CriteriaMission } from './dto/mission.dto'
import { Mission } from './mission.entity'
import { MISSION_STATUS } from './mission.enum'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  getWhereOptions(criteria: CriteriaMission): FindConditions<Mission> {
    const where: FindConditions<Mission> = {}

    if (criteria.id != null) where.id = criteria.id
    if (criteria.campaignId != null) where.campaignId = criteria.campaignId
    if (criteria.isActive != null) where.isActive = criteria.isActive
    if (criteria.status != null) where.status = criteria.status
    if (criteria.priority != null) where.priority = criteria.priority
    if (criteria.targetType != null) where.targetType = criteria.targetType

    if (criteria.ids) {
      if (criteria.ids.length === 0) criteria.ids.push(0)
      where.id = In(criteria.ids)
    }
    if (criteria.campaignIds) {
      if (criteria.campaignIds.length === 0) criteria.campaignIds.push(0)
      where.campaignId = In(criteria.campaignIds)
    }
    if (criteria.statuses?.length) where.status = In(criteria.statuses)
    if (criteria.targetTypes?.length) where.targetType = In(criteria.targetTypes)

    if (criteria.activeTime != null) {
      where.openingDate = LessThanOrEqual(criteria.activeTime)
      where.closingDate = MoreThanOrEqual(criteria.activeTime)
    }

    if (criteria.id_notIn) {
      if (criteria.id_notIn.length === 0) criteria.id_notIn.push(0)
      where.id = Not(In(criteria.id_notIn))
    }

    return where
  }

  async findManyBy(criteria: CriteriaMission): Promise<Mission[]> {
    const where = this.getWhereOptions(criteria)

    return await this.missionRepository.find({ where })
  }

  async findMany(
    criteria: CriteriaMission,
    order: { [P in keyof Mission]?: 'ASC' | 'DESC' },
  ): Promise<Mission[]> {
    const where = this.getWhereOptions(criteria)

    return await this.missionRepository.find({ where, order })
  }

  async insertOne(mission: Partial<Mission>): Promise<Mission> {
    const insert = await this.missionRepository.insert(mission) // save loi JSON, insert tra ve thieu campaignID, nen can findOne lai
    return await this.missionRepository.findOne({ id: insert.raw.insertId })
  }

  async findOneBy(criteria: CriteriaMission): Promise<Mission> {
    const where = this.getWhereOptions(criteria)

    return await this.missionRepository.findOne({ where })
  }

  async update(criteria: CriteriaMission, dto: Partial<Mission>) {
    const where = this.getWhereOptions(criteria)
    const update = this.missionRepository.create(dto)
    return this.missionRepository.update(where, update)
  }

  async updateStatusByTime(time: number) {
    await this.missionRepository.update(
      { closingDate: LessThanOrEqual(time) },
      { status: MISSION_STATUS.ENDED },
    )

    await this.missionRepository.update(
      {
        openingDate: LessThanOrEqual(time),
        closingDate: MoreThan(time),
        status: Not(MISSION_STATUS.OUT_OF_BUDGET),
      },
      { status: MISSION_STATUS.RUNNING },
    )
  }

  async pagination(options: PaginationDto<Mission>, criteria?: CriteriaMission) {
    const where = this.getWhereOptions(criteria)
    const { take, page, sortField, sortType, searchField, searchText } = options

    const [data, total] = await this.missionRepository.findAndCount({
      where: {
        ...where,
        ...(searchField && searchText ? { [searchField]: Like(`%${searchText}%`) } : {}),
      },
      order: {
        ...(sortField && sortType ? { [sortField]: sortType } : {}),
        priority: 'DESC',
        id: 'ASC',
      },
      take,
      skip: (page - 1) * take,
    })
    const totalPage = Math.ceil(total / take)

    return { total, page, take, data, totalPage }
  }
}
