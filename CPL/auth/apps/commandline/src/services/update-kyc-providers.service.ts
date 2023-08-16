import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { Not, Repository } from 'typeorm'

@Command({ name: 'update:kyc-providers' })
export class UpdateKycProviderService {
  private readonly logger = new Logger(UpdateKycProviderService.name)
  constructor(
    @InjectRepository(UserKyc)
    private readonly userKycRepository: Repository<UserKyc>,
    @InjectRepository(UserKycHistory)
    private readonly userKycHistoryRepository: Repository<UserKycHistory>,
  ) {}

  async run(): Promise<void> {
    const countKyc = await this.userKycRepository.count()
    const countKycHistory = await this.userKycHistoryRepository.count()
    const PER_PAGE = 5000
    const numberOfPageKyc = Math.round(countKyc / PER_PAGE) + 1
    const numberOfPageKycHistory = Math.round(countKycHistory / PER_PAGE) + 1
    const kycPromises = []
    for (let i = 0; i < numberOfPageKyc; i++) {
      kycPromises.push(this.migrateKyc(PER_PAGE, i))
    }
    await Promise.all(kycPromises)
    const kycHistoryPromises = []
    for (let i = 0; i < numberOfPageKycHistory; i++) {
      kycHistoryPromises.push(this.migrateKycHistory(PER_PAGE, i))
    }
    await Promise.all(kycHistoryPromises)
    this.logger.log('Done')
  }

  async migrateKyc(perPage: number, page: number) {
    const userKycs = await this.userKycRepository
      .createQueryBuilder()
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (const userKyc of userKycs) {
      if (userKyc.imageProvider == 0) continue
      userKyc.imageProviders = [userKyc.imageProvider]
      userKyc.riskScanProviders = [userKyc.riskScanProvider]
      await this.userKycRepository.save(userKyc)
      this.logger.log(`Processed kyc id: ${userKyc.id}`)
    }
  }

  async migrateKycHistory(perPage: number, page: number) {
    const userKycHistories = await this.userKycHistoryRepository
      .createQueryBuilder()
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (const userKycHistory of userKycHistories) {
      if (userKycHistory.imageProvider == 0) continue
      userKycHistory.imageProviders = [userKycHistory.imageProvider]
      userKycHistory.riskScanProviders = [userKycHistory.riskScanProvider]
      await this.userKycHistoryRepository.save(userKycHistory)
      this.logger.log(`Processed kyc history id: ${userKycHistory.id}`)
    }
  }
}
