import { UserStatus, UserType } from '@lib/user/enum/user.enum'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class ListDividendUserDto {
  @ApiPropertyOptional({ example: 1 })
  @Expose({ name: 'page' })
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ name: 'take', example: 10 })
  @Expose({ name: 'take' })
  @Type(() => Number)
  take?: number

  @ApiPropertyOptional({
    name: 'is_banned',
    example: undefined,
    enum: ['0', '1'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == undefined) return undefined
    return value == 1
  })
  @Expose({ name: 'is_banned' })
  isBanned?: boolean

  @ApiPropertyOptional({
    name: 'statuses[]',
    example: [UserStatus.INACTIVE, UserStatus.PENDING_DELETE],
    type: UserStatus,
    isArray: true,
  })
  @Type(() => Number)
  @Expose({ name: 'statuses' })
  statuses: UserStatus[]

  @ApiPropertyOptional({
    name: 'types[]',
    example: [UserType.BOT, UserType.FUND_USER],
    type: UserType,
    isArray: true,
  })
  @Type(() => Number)
  @Expose({ name: 'types' })
  types?: UserType[]
}
