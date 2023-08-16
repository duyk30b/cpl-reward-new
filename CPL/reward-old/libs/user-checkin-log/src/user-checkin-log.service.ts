import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'
import { FilterUserCheckinLogDto } from './dto/filter-user-checkint-log.dto'
import { InsertUserCheckinLogDto } from './dto/insert-user-checkint-log.dto'
import { UserCheckinLog } from './entities/user-checkin-log.entity'

@Injectable()
export class UserCheckinLogService {
  constructor(
    @InjectRepository(UserCheckinLog)
    private userCheckinLogRepository: Repository<UserCheckinLog>,
  ) {}

  async upsert(inputLog: InsertUserCheckinLogDto) {
    const inputLogObject = plainToInstance(UserCheckinLog, inputLog, {
      ignoreDecorators: true,
    })

    return await this.userCheckinLogRepository
      .createQueryBuilder()
      .insert()
      .into(UserCheckinLog)
      .values(inputLogObject)
      .orUpdate(['last_ignore_display', 'last_checkin'], 'UNIQUE_USER_CAMPAIGN')
      .execute()
  }

  async findOneByUserCampaign(filterInput: FilterUserCheckinLogDto) {
    return await this.userCheckinLogRepository.findOne({
      where: filterInput,
    })
  }
}
