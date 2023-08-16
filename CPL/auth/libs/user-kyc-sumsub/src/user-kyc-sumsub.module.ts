import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SumsubInfoHistory, SumsubResponse } from './entities'
import { SumsubInfoHistoryService } from './services/sumsub-info-history.service'
import { SumsubResponseService } from './services/sumsub-response.service'

@Module({
  imports: [TypeOrmModule.forFeature([SumsubInfoHistory, SumsubResponse])],
  providers: [SumsubInfoHistoryService, SumsubResponseService],
  exports: [SumsubInfoHistoryService, SumsubResponseService],
})
export class UserKycSumsubModule {}
