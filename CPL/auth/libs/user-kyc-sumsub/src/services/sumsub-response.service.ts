import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SumsubResponse } from '../entities'
import { IUpsertSumsubResponse } from '../user-kyc-sumsub.type'

@Injectable()
export class SumsubResponseService {
  constructor(
    @InjectRepository(SumsubResponse)
    private readonly sumsubResponseRepository: Repository<SumsubResponse>,
  ) {}

  async findByUserKycHistoryId(userKycHistoryId: string) {
    return await this.sumsubResponseRepository.findOne({
      userKycHistoryId,
    })
  }

  async upsertSumsubResponse(
    userKycHistoryId: string,
    updateDto: IUpsertSumsubResponse,
  ) {
    const existed = await this.sumsubResponseRepository.findOne({
      userKycHistoryId,
    })
    if (!existed) {
      await this.sumsubResponseRepository.save({
        userKycHistoryId,
        ...updateDto,
      })
    }
    await this.sumsubResponseRepository.update({ userKycHistoryId }, updateDto)
  }
}
