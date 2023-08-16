import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SumsubInfoHistory } from '../entities'
import { ICreateSumsubInfoHistoryDto } from '../user-kyc-sumsub.type'

@Injectable()
export class SumsubInfoHistoryService {
  constructor(
    @InjectRepository(SumsubInfoHistory)
    private readonly sumsubInfoHistoryRepository: Repository<SumsubInfoHistory>,
  ) {}

  async findByUserKycHistoryId(userKycHistoryId: string) {
    return await this.sumsubInfoHistoryRepository.findOne({
      userKycHistoryId,
    })
  }

  async createSumsubInfoHistory(
    createSumsubInfoHistoryDto: ICreateSumsubInfoHistoryDto,
  ) {
    let info = await this.sumsubInfoHistoryRepository.findOne({
      userKycHistoryId: createSumsubInfoHistoryDto.userKycHistoryId,
    })
    if (!info) info = new SumsubInfoHistory()
    info.userId = createSumsubInfoHistoryDto.userId
    info.userKycHistoryId = createSumsubInfoHistoryDto.userKycHistoryId
    info.reviewAnswer = createSumsubInfoHistoryDto.reviewAnswer
    info.reviewRejectType = createSumsubInfoHistoryDto.reviewRejectType
    info.compareStatus = createSumsubInfoHistoryDto.compareStatus
    info.livenessStatus = createSumsubInfoHistoryDto.livenessStatus
    info.identityDocumentVerificationStatus =
      createSumsubInfoHistoryDto.identityDocumentVerificationStatus
    info.duplicateStatus = createSumsubInfoHistoryDto.duplicateStatus
    return await this.sumsubInfoHistoryRepository.save(info)
  }
}
