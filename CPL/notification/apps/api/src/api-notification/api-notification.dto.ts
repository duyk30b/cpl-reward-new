import { EValidationError, TransformInt } from '@libs/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsNumber, IsNumberString, IsOptional } from 'class-validator'

export class NotificationOfUserFilterDto {
  @ApiProperty({ name: 'notification_category_id', required: false })
  @Expose({ name: 'notification_category_id' })
  @IsOptional()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  @Transform(({ value }) => (value != 0 ? value : undefined))
  notificationCategoryId: number

  @ApiProperty({ name: 'from_time', required: false })
  @Expose({ name: 'from_time' })
  @IsOptional()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  fromTime: number

  @ApiProperty({ name: 'to_time', required: false })
  @Expose({ name: 'to_time' })
  @IsOptional()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  toTime: number

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: EValidationError.IS_NUMBER })
  @TransformInt()
  limit: number
}

export class NotificationCountUnreadFilterDto {
  @ApiProperty({ name: 'notification_category_id', required: false })
  @Expose({ name: 'notification_category_id' })
  @IsOptional()
  @IsNumberString({}, { message: EValidationError.IS_NUMBER })
  @Transform(({ value }) => (value != 0 ? value : undefined))
  notificationCategoryId: number
}

export class ApiNotificationDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty({ name: 'notification_category_id' })
  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: number

  @ApiProperty()
  @Expose()
  image: string

  @ApiProperty()
  @Expose()
  slug: string

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  content: string

  @ApiProperty({ name: 'publish_at' })
  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number
}
