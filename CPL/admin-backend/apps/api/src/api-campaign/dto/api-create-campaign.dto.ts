import {
  CAMPAIGN_STATUS,
  CAMPAIGN_TYPE,
} from '@lib/grpc-client/reward/reward.enum'
import { IsGreaterThan } from '@lib/util/decorators/validation.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsIn, IsInt, IsNotEmpty, Length, Max, Min } from 'class-validator'

export class ApiCreateCampaignDto {
  @ApiPropertyOptional({ name: 'type', example: 1 })
  @Expose({ name: 'type' })
  @Transform(({ value }) => value || CAMPAIGN_TYPE.DEFAULT)
  // @IsEnum(CAMPAIGN_TYPE)
  type: CAMPAIGN_TYPE

  @ApiPropertyOptional({ name: 'reset_time', example: '12:30' })
  @Expose({ name: 'reset_time' })
  // @IsMilitaryTime()
  resetTime: string

  @ApiProperty({ name: 'title', example: 'Demo Campaign 1' })
  @Expose({ name: 'title' })
  @IsNotEmpty()
  @Length(0, 255)
  title: string

  @ApiPropertyOptional({ name: 'title_ja', example: 'Ja Demo Campaign 1' })
  @Expose({ name: 'title_ja' })
  @IsNotEmpty()
  @Length(0, 255)
  titleJa: string

  @ApiProperty({ name: 'description', example: 'Demo Campaign 1 Description' })
  @Expose({ name: 'description' })
  @IsNotEmpty()
  @Length(0, 65535)
  description: string

  @ApiPropertyOptional({
    name: 'description_ja',
    example: 'Ja Demo Campaign 1 Description',
  })
  @Expose({ name: 'description_ja' })
  @IsNotEmpty()
  @Length(0, 65535)
  descriptionJa: string

  @ApiProperty({ name: 'notification_link', example: 'http://localhost:9000/' })
  @IsNotEmpty()
  @Expose({ name: 'notification_link' })
  notificationLink: string

  @ApiPropertyOptional({
    name: 'notification_link_ja',
    example: 'http://localhost:9000/',
  })
  @Expose({ name: 'notification_link_ja' })
  @IsNotEmpty()
  @Length(0, 65535)
  notificationLinkJa: string

  @ApiProperty({
    name: 'campaign_image',
    example: 'http://localhost:9000/image',
  })
  @Expose({ name: 'campaign_image' })
  @Length(0, 255)
  campaignImage: string

  @ApiPropertyOptional({
    name: 'campaign_image_ja',
    example: 'http://localhost:9000/ja-image',
  })
  @Expose({ name: 'campaign_image_ja' })
  @IsNotEmpty()
  @Length(0, 255)
  campaignImageJa: string

  @ApiProperty({ name: 'start_date', example: 1679561220 })
  @Expose({ name: 'start_date' })
  @IsNotEmpty()
  startDate: number

  @ApiProperty({ name: 'end_date', example: 1680943620 })
  @Expose({ name: 'end_date' })
  @IsNotEmpty()
  @IsGreaterThan('startDate', {
    message: 'End date must be greater than start date',
  })
  endDate: number

  @ApiProperty({ name: 'priority', example: 34 })
  @Expose({ name: 'priority' })
  @IsInt()
  @Max(2147483647)
  @Min(0)
  priority: number

  @ApiProperty({ name: 'status', example: CAMPAIGN_STATUS.COMING_SOON })
  @Expose({ name: 'status' })
  status: CAMPAIGN_STATUS

  @ApiProperty({ name: 'is_active', example: 0 })
  @Expose({ name: 'is_active' })
  @IsIn([0, 1])
  isActive: number

  @ApiProperty({ name: 'is_hidden', example: 0 })
  @Expose({ name: 'is_hidden' })
  @IsIn([0, 1])
  isHidden: number
}
