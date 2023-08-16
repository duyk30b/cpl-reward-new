import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RewardRule } from './reward-rule.entity'
import { RewardRuleService } from './reward-rule.service'

@Module({
  imports: [TypeOrmModule.forFeature([RewardRule])],
  providers: [RewardRuleService],
  exports: [RewardRuleService],
})
export class RewardRuleModule {}
