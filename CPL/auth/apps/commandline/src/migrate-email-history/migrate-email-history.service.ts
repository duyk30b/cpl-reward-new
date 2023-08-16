import { EmailChangeHistory } from '@lib/email-change-history'
import { timestampToDate } from '@lib/util'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { LessThan, Repository } from 'typeorm'
import { BceEmailChangeHistory } from './bce-email-change-history.entity'

@Command({ name: 'migrate:email-history' })
export class MigrateEmailHistoryService {
  private readonly logger = new Logger(MigrateEmailHistoryService.name)
  constructor(
    @InjectRepository(EmailChangeHistory)
    private readonly authEmailHistoryRepository: Repository<EmailChangeHistory>,
    @InjectRepository(BceEmailChangeHistory, 'bce')
    private readonly bceEmailHistoryRepository: Repository<BceEmailChangeHistory>,
  ) {}

  async run(): Promise<void> {
    const timeToStart = await this.getTimeToStartMigrate()
    const dateToStart = timestampToDate(timeToStart)
    const count = await this.bceEmailHistoryRepository.count({
      createdAt: LessThan(dateToStart),
    })
    const PER_PAGE = 5000
    const numberOfPage = Math.round(count / PER_PAGE) + 1
    this.logger.log(`Start from date: ${dateToStart}`)
    for (let i = 0; i < numberOfPage; i++) {
      await this.migrate(dateToStart, PER_PAGE, i)
    }
    this.logger.log('Done')
  }

  async getTimeToStartMigrate() {
    const query =
      this.authEmailHistoryRepository.createQueryBuilder('email_history')
    query.select('MIN(email_history.createdAt)', 'max')
    const result = await query.getRawOne()
    return parseInt(result.max) || 9999999999999
  }

  async migrate(dateToStart: string, perPage: number, page: number) {
    const bceHistories = await this.bceEmailHistoryRepository
      .createQueryBuilder()
      .where({
        createdAt: LessThan(dateToStart),
      })
      .orderBy('created_at', 'DESC')
      .addOrderBy('id', 'DESC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (let i = 0; i < bceHistories.length; i++) {
      const bceHistory = bceHistories[i]
      const authHistory = new EmailChangeHistory()
      authHistory.userId = bceHistory.userId
      authHistory.oldEmail = bceHistory.oldEmail
      authHistory.newEmail = bceHistory.newEmail
      authHistory.isModifiedByUser = bceHistory.editBy == 'user'
      authHistory.createdAt = new Date(bceHistory.createdAt).getTime()
      await this.authEmailHistoryRepository.save(authHistory)
      this.logger.log(`Processed bce history id: ${bceHistory.id}`)
    }
  }
}
