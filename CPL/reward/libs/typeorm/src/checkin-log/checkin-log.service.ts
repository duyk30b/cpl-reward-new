import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { CriteriaCheckInLog } from './checkin-log.dto'
import { CheckInLog } from './checkin-log.entity'

@Injectable()
export class CheckInLogService {
  constructor(@InjectRepository(CheckInLog) private checkinLogRepository: Repository<CheckInLog>) {}

  getWhereOptions(criteria: CriteriaCheckInLog = {}): FindConditions<CheckInLog> {
    const where: FindConditions<CheckInLog> = {}

    if (criteria.id !== undefined) where.id = criteria.id
    if (criteria.userId !== undefined) where.userId = criteria.userId
    if (criteria.campaignId !== undefined) where.campaignId = criteria.campaignId
    return where
  }

  async findOneBy(criteria: CriteriaCheckInLog) {
    const where = this.getWhereOptions(criteria)
    return await this.checkinLogRepository.findOne({ where })
  }

  async upsertLastCheckIn(dto: Partial<CheckInLog>) {
    const checkInLog = this.checkinLogRepository.create(dto)

    return await this.checkinLogRepository
      .createQueryBuilder()
      .insert()
      .into(CheckInLog)
      .values(checkInLog)
      .orUpdate(['last_checkin', 'last_ignore_display'], 'UNIQUE_USER_CAMPAIGN')
      .execute()
  }

  async upsertLastIgnoreCheckIn(dto: Partial<CheckInLog>) {
    const checkInLog = this.checkinLogRepository.create(dto)

    return await this.checkinLogRepository
      .createQueryBuilder()
      .insert()
      .into(CheckInLog)
      .values(checkInLog)
      .orUpdate(['last_ignore_display'], 'UNIQUE_USER_CAMPAIGN')
      .execute()
  }
}
