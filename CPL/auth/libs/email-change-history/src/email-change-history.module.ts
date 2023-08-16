import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailChangeHistory } from './email-change-history.entity'
import { EmailChangeHistoryService } from './email-change-history.service'

@Module({
  imports: [TypeOrmModule.forFeature([EmailChangeHistory])],
  providers: [EmailChangeHistoryService],
  exports: [EmailChangeHistoryService],
})
export class EmailChangeHistoryModule {}
