import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { GrpcRewardController } from './grpc-reward.controller'
import { GrpcRewardService } from './grpc-reward.service'

@Module({
  imports: [RewardAggregateModule, RewardHistoryModule],
  controllers: [GrpcRewardController],
  providers: [GrpcRewardService],
})
export class GrpcRewardModule {}
