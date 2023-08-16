import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateEnterpriseInfoDto } from '@lib/user/dto/create-enterprise-info.dto'
import { EnterpriseInfoHistory } from '@lib/user/entities/enterprise-info-history.entity'

@Injectable()
export class EnterpriseInfoHistoryService {
  constructor(
    @InjectRepository(EnterpriseInfoHistory)
    private readonly enterpriseInfoHistoryRepository: Repository<EnterpriseInfoHistory>,
  ) {}

  async saveEnterpriseInfoHistory(
    userId: string,
    enterpriseInfoDto: CreateEnterpriseInfoDto,
  ) {
    const info = plainToClass(
      EnterpriseInfoHistory,
      {
        ...enterpriseInfoDto,
        userId,
      },
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    return await this.enterpriseInfoHistoryRepository.save(info)
  }

  async getById(id: number) {
    return await this.enterpriseInfoHistoryRepository.findOne(id)
  }
}
