import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { KycImageProvider } from '@lib/user-kyc/enum/user-kyc.enum'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AmazonKycService } from '@lib/kyc-provider/services/amazon-kyc.service'
import { Command } from 'nest-commander'
import { Repository, Not } from 'typeorm'

@Command({ name: 'migrate:face-index' })
export class MigrateFaceIndexService {
  private readonly logger = new Logger(MigrateFaceIndexService.name)
  constructor(
    @InjectRepository(UserKyc)
    private readonly userKycRepository: Repository<UserKyc>,
    @InjectRepository(UserKycHistory)
    private readonly userKycHistoryRepository: Repository<UserKycHistory>,
    private readonly amazonKycService: AmazonKycService,
  ) {}

  async run(): Promise<void> {
    const count = await this.userKycRepository.count({
      imageProvider: Not(KycImageProvider.AMAZON),
    })
    const PER_PAGE = 5000
    const numberOfPage = Math.round(count / PER_PAGE) + 1
    const promises = []
    for (let i = 0; i < numberOfPage; i++) {
      promises.push(this.migrate(PER_PAGE, i))
    }
    await Promise.all(promises)
    this.logger.log('Done')
  }

  async migrate(perPage: number, page: number) {
    const userKycs = await this.userKycRepository
      .createQueryBuilder()
      .where({
        imageProvider: Not(KycImageProvider.AMAZON),
      })
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (const userKyc of userKycs) {
      try {
        await this.amazonKycService.process(userKyc)
        const history = await this.userKycHistoryRepository.findOne(
          userKyc.userKycHistoryId,
        )
        history.imageProvider = KycImageProvider.AMAZON
        await this.userKycHistoryRepository.save(history)
        userKyc.imageProvider = KycImageProvider.AMAZON
        await this.userKycRepository.save(userKyc)
        this.logger.log(`Migrated user: ${userKyc.userId}`)
      } catch (e) {
        this.logger.error(`Error migrate user: ${userKyc.userId}`)
        this.logger.error(e, e.stack)
      }
    }
  }
}
