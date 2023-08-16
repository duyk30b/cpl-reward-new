import { MISSION_STATUS } from '@lib/grpc-client/mission/mission.enum'
import { IsGreaterThan } from '@lib/util/decorators/validation.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { GrantTargetDto } from './grant-target.dto'
import { JudgmentConditionDto } from './judgment-condition.dto'
import { CreateRewardRuleDto } from './reward-rule.dto'
import { UserConditionDto } from './user-condition.dto'

export class CreateMissionDto {
  @ApiProperty({ type: Number, required: true })
  @Expose({ name: 'campaign_id' })
  @IsNotEmpty()
  campaignId: number

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  title: string

  @ApiProperty({ name: 'title_ja', required: true })
  @Expose({ name: 'title_ja' })
  @IsNotEmpty()
  @Length(0, 255)
  titleJa: string

  @ApiProperty({ type: String, required: true })
  @Expose({ name: 'detail_explain' })
  @Length(0, 65535)
  detailExplain: string

  @ApiProperty({ name: 'detail_explain_ja', required: true })
  @Expose({ name: 'detail_explain_ja' })
  @IsNotEmpty()
  @Length(0, 65535)
  detailExplainJa: string

  @ApiProperty({ type: String })
  @Expose({ name: 'guide_link' })
  @Length(0, 65535)
  guideLink: string

  @ApiProperty({ name: 'notification_link_ja', required: false })
  @Expose({ name: 'guide_link_ja' })
  @Length(0, 65535)
  guideLinkJa: string

  @ApiProperty({ type: Number, required: true })
  @Expose({ name: 'opening_date' })
  @IsNotEmpty()
  openingDate: number

  @ApiProperty({ type: Number, required: true })
  @Expose({ name: 'closing_date' })
  @IsNotEmpty()
  @IsGreaterThan('openingDate', {
    message: 'Closing date must be greater than opening date',
  })
  closingDate: number

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'judgment_conditions' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => JudgmentConditionDto)
  judgmentConditions: JudgmentConditionDto[]

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'user_conditions' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => UserConditionDto)
  userConditions: UserConditionDto[]

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'display_conditions' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => UserConditionDto)
  displayConditions: UserConditionDto[]

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'grant_target' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => GrantTargetDto)
  grantTarget: GrantTargetDto[]

  @ApiProperty({ type: Number, required: false })
  @Expose()
  @Max(2147483647)
  @Min(0)
  @IsInt()
  priority: number

  @ApiProperty({ type: String })
  @Expose({ name: 'limit_received_reward' })
  limitReceivedReward: number

  @Expose()
  status: MISSION_STATUS = 0

  @Expose({ name: 'is_active' })
  @IsIn([0, 1])
  isActive = 1

  @ApiProperty({ type: Array, required: true })
  @Expose({ name: 'reward_rules' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateRewardRuleDto)
  rewardRules: CreateRewardRuleDto[]
}
