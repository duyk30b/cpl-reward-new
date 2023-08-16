import { EmailChangeHistory } from '@lib/email-change-history'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BceEmailChangeHistory } from './bce-email-change-history.entity'
import { MigrateEmailHistoryService } from './migrate-email-history.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailChangeHistory]),
    TypeOrmModule.forFeature([BceEmailChangeHistory], 'bce'),
  ],
  providers: [MigrateEmailHistoryService],
})
export class MigrateEmailHistoryModule {}
