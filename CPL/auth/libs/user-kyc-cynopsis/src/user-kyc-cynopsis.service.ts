import { Injectable } from '@nestjs/common'
import { UserKycCynopsis } from './entities/user-kyc-cynopsis.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserKycCynopsisDto } from './dto/create-user-kyc-cynopsis.dto'
import { plainToClass } from 'class-transformer'
import { UpdateUserKycCynopsisDto } from './dto/update-user-kyc-cynopsis.dto'
import { CompareStatus, RiskScanStatus } from '@lib/user-kyc/enum/user-kyc.enum'

@Injectable()
export class UserKycCynopsisService {
  constructor(
    @InjectRepository(UserKycCynopsis)
    private readonly cynopsisRepository: Repository<UserKycCynopsis>,
  ) {}

  async getCynopsisByHistoryId(historyId: string): Promise<UserKycCynopsis> {
    const result = await this.cynopsisRepository.findOne({
      historyId: historyId,
    })
    if (result) return result

    const newRecord = new UserKycCynopsis()
    newRecord.historyId = historyId
    newRecord.ocrStatus = CompareStatus.NOT_RUNNING_YET
    newRecord.artemisStatus = RiskScanStatus.NOT_RUNNING_YET
    return await this.cynopsisRepository.save(newRecord)
  }

  async createCynopsis(createCynopsisDto: CreateUserKycCynopsisDto) {
    const info = plainToClass(
      UserKycCynopsis,
      {
        ...createCynopsisDto,
      },
      { exposeUnsetFields: false },
    )
    return await this.cynopsisRepository.save(info)
  }

  async updateCynopsis(
    id: string,
    updateCynopsisDto: UpdateUserKycCynopsisDto,
  ) {
    const info = plainToClass(
      UserKycCynopsis,
      {
        ...updateCynopsisDto,
      },
      { ignoreDecorators: true, exposeUnsetFields: false },
    )
    return await this.cynopsisRepository.update({ id: id }, info)
  }

  async updateCynopsisCustomerId(
    cynopsis: UserKycCynopsis,
    customerId: number,
  ) {
    cynopsis.customerId = customerId
    return await this.cynopsisRepository.save(cynopsis)
  }

  async updateCynopsisOcrStatus(cynopsis: UserKycCynopsis, ocrStatus: number) {
    cynopsis.ocrStatus = ocrStatus
    return await this.cynopsisRepository.save(cynopsis)
  }

  async updateCynopsisRecordAndCrpId(
    cynopsis: UserKycCynopsis,
    recordAndCrpId: { record: number; id: number },
  ) {
    cynopsis.recordId = recordAndCrpId.record
    cynopsis.crpId = recordAndCrpId.id
    return await this.cynopsisRepository.save(cynopsis)
  }

  async updateCynopsisScanResult(
    cynopsis: UserKycCynopsis,
    status: number,
    cynopsisData?,
  ) {
    cynopsis.artemisStatus = status
    cynopsis.cynopsisData = cynopsisData
    return await this.cynopsisRepository.save(cynopsis)
  }
}
