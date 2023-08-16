import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { Repository } from 'typeorm'

@Command({ name: 'fix:kyc-image' })
export class FixKycImageService {
  private readonly logger = new Logger(FixKycImageService.name)
  constructor(
    @InjectRepository(UserKyc)
    private readonly userKycRepository: Repository<UserKyc>,
    @InjectRepository(UserKycHistory)
    private readonly userKycHistoryRepository: Repository<UserKycHistory>,
  ) {}

  async run(): Promise<void> {
    const userKycs = await this.userKycRepository
      .createQueryBuilder('user_kyc')
      .where('files like "%http%"')
      .getMany()
    for (const userKyc of userKycs) {
      for (const file of userKyc.files) {
        if (file.name.includes('http')) {
          file.name = this.getFileNameFromLink(file.name)
        }
      }
      await this.userKycRepository.save(userKyc)
      this.logger.log(`Processed user kyc id ${userKyc.id}`)
    }

    const userKycHistories = await this.userKycHistoryRepository
      .createQueryBuilder('user_kyc_history')
      .where('files like "%http%"')
      .getMany()
    for (const userKycHistory of userKycHistories) {
      for (const file of userKycHistory.files) {
        if (file.name.includes('http')) {
          file.name = this.getFileNameFromLink(file.name)
        }
      }
      await this.userKycHistoryRepository.save(userKycHistory)
      this.logger.log(`Processed user kyc history id ${userKycHistory.id}`)
    }
    this.logger.log('Done')
  }

  private getFileNameFromLink(link: string) {
    const url = new URL(link)
    const path = url.pathname
    return path.replace(/^\//, '')
  }
}
