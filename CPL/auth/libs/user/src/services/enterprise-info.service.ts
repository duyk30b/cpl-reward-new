import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateEnterpriseInfoDto } from '@lib/user/dto/create-enterprise-info.dto'
import { EnterpriseInfo } from '@lib/user/entities/enterprise-info.entity'

@Injectable()
export class EnterpriseInfoService {
  constructor(
    @InjectRepository(EnterpriseInfo)
    private readonly enterpriseInfoRepository: Repository<EnterpriseInfo>,
  ) {}

  async getEnterpriseInfoByUserId(userId: string) {
    return await this.enterpriseInfoRepository.findOne({
      where: { userId: userId },
    })
  }

  async saveEnterpriseInfo(
    userId: string,
    enterpriseInfoDto: CreateEnterpriseInfoDto,
  ) {
    const existingInfo = await this.getEnterpriseInfoByUserId(userId)
    const info = plainToClass(
      EnterpriseInfo,
      {
        ...existingInfo,
        ...enterpriseInfoDto,
        userId,
      },
      {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
      },
    )
    return await this.enterpriseInfoRepository.save(info)
  }
}
