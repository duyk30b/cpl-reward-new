import { MultiLanguageFieldDto } from '@lib/grpc-client/grpc-client.dto'
import { TransformBoolean, ValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsIn,
  IsNotEmpty,
  Max,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Readable } from 'typeorm/platform/PlatformTools'

export class GroupNotificationFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  limit: number

  @ApiProperty({ name: 'notification_category_id', required: false })
  @Expose({ name: 'notification_category_id' })
  notificationCategoryId: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  lang: string

  @ApiProperty({ name: 'is_active', required: false })
  @Expose({ name: 'is_active' })
  @TransformBoolean()
  isActive: boolean

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class ApiMailScheduleDto {
  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  @IsNotEmpty()
  content: MultiLanguageFieldDto

  @Expose()
  userGroups: string[]
}

export class ApiPushScheduleDto {
  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  @IsNotEmpty()
  content: MultiLanguageFieldDto

  @Expose()
  userGroups: string[]
}

export class ApiGroupNotificationDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  image: string

  @ApiProperty({ name: 'notification_category_id' })
  @Expose({ name: 'notification_category_id' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  notificationCategoryId: number

  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  @IsNotEmpty()
  title: MultiLanguageFieldDto

  @ApiProperty()
  @Expose()
  @Type(() => MultiLanguageFieldDto)
  @ValidateNested()
  @IsNotEmpty()
  content: MultiLanguageFieldDto

  @ApiProperty({ name: 'is_active' })
  @Expose({ name: 'is_active' })
  @IsNotEmpty()
  isActive: boolean

  @ApiProperty({ name: 'publish_at' })
  @Expose({ name: 'publish_at' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  publishAt: number

  // @Expose({ name: 'need_send_mail' })
  // @IsNotEmpty()
  // needSendMail: boolean

  @ApiProperty({ name: 'need_send_push' })
  @Expose({ name: 'need_send_push' })
  @IsNotEmpty()
  needSendPush: boolean

  // @ApiProperty({ name: 'mail_schedule' })
  // @Expose()
  // @Type(() => ApiMailScheduleDto)
  // @ValidateNested()
  // @IsNotEmpty()
  // @ValidateIf((obj) => obj.needSendMail)
  // mailSchedule: ApiMailScheduleDto

  @ApiProperty({ name: 'push_schedule' })
  @Expose({ name: 'push_schedule' })
  @Type(() => ApiPushScheduleDto)
  @ValidateNested()
  @IsNotEmpty()
  @ValidateIf((obj) => {
    return obj.needSendPush
  })
  pushSchedule: ApiPushScheduleDto
}

export class NotificationImageDto implements Express.Multer.File {
  @Expose()
  fieldname: string

  @Expose()
  encoding

  @Expose()
  stream: Readable

  @Expose()
  destination: string

  @Expose()
  path: string

  @Expose()
  originalname: string

  @Expose()
  @IsIn(['image/png', 'image/jpeg'], {
    message: 'File type must be one of the following: image/png, image/jpeg',
  })
  mimetype: string

  @Expose()
  @Max(3000000)
  size: number

  @Expose()
  filename: string

  @Expose()
  buffer: Buffer
}
