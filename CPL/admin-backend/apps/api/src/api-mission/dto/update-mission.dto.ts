import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { CreateMissionDto } from './create-mission.dto'
import { UpdateRewardRuleDto } from './reward-rule.dto'

export class UpdateMissionDto extends CreateMissionDto {
  @Expose()
  id: number

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'reward_rules' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => UpdateRewardRuleDto)
  rewardRules: UpdateRewardRuleDto[]
}
