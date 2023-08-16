import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GetMissionsDto {
  @ApiProperty({ type: Number, required: true })
  @Expose({ name: 'campaign_id' })
  @IsNotEmpty()
  campaignId: number
}
