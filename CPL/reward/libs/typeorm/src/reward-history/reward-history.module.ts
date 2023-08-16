import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RewardHistory } from './reward-history.entity'
import { RewardHistoryService } from './reward-history.service'

@Module({
  imports: [TypeOrmModule.forFeature([RewardHistory])],
  providers: [RewardHistoryService],
  exports: [RewardHistoryService],
})
export class RewardHistoryModule {}
