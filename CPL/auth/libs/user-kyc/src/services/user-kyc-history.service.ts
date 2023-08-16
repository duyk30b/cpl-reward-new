import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateUserKycHistoryDto } from '../dto/create-user-kyc-history.dto'
import { UserKycHistory } from '../entities/user-kyc-history.entity'
import { KycImageProvider, KycRiskScanProvider } from '../enum/user-kyc.enum'

@Injectable()
export class UserKycHistoryService {
  constructor(
    @InjectRepository(UserKycHistory)
    private readonly userKycHistoryRepository: Repository<UserKycHistory>,
  ) {}

  async saveUserKycHistory(userKycHistoryDto: CreateUserKycHistoryDto) {
    const history = plainToClass(UserKycHistory, userKycHistoryDto, {
      exposeUnsetFields: false,
    })
    if (!KycImageProvider[history.imageProvider]) {
      history.imageProvider = KycImageProvider.AMAZON
    }
    if (!KycRiskScanProvider[history.riskScanProvider]) {
      history.riskScanProvider = KycRiskScanProvider.CYNOPSIS
    }
    return await this.userKycHistoryRepository.save(history)
  }

  async getListUserKycHistory(userId: string) {
    return await this.userKycHistoryRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    })
  }

  async getById(userKycHistoryId: string) {
    return await this.userKycHistoryRepository.findOne({ id: userKycHistoryId })
  }

  async getLatestUserKycHistory(userId: string) {
    return await this.userKycHistoryRepository.findOne({
      where: { userId: userId },
      order: { id: 'DESC' },
    })
  }

  async updateIdDocumentNo(userKycHistoryId: string, idDocumentNo: string) {
    await this.userKycHistoryRepository.update(
      { id: userKycHistoryId },
      { idDocumentNo },
    )
  }
}
