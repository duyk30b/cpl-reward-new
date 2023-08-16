import { MissionUserLogStatus } from '@lib/grpc-client/reward/reward.enum'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsIn } from 'class-validator'

export class GetMissingRewardDto {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  page: number

  @ApiProperty({
    type: Number,
  })
  @Expose()
  limit: number

  @ApiProperty({ required: false, type: String })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class InputUpdateRewardLogDto {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  @IsIn([MissionUserLogStatus.RESOLVED, MissionUserLogStatus.RETRYING])
  status: MissionUserLogStatus
}
