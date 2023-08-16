import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import {
  BaseCreateUserTradingRequestDto,
  BaseGrpcUserTradingPaginationResponse,
  BaseRemoveUserTradingRequestDto,
  BaseRemoveUserTradingResponseDto,
  BaseUpdateUserTradingRequestDto,
  BaseUserTradingDto,
  GetBaseUserTradingQuery,
} from './base-user-trading.dto'

export class GetUserUnlimitedQuery extends GetBaseUserTradingQuery {}

export class RemoveFromUnlimitedRequestDto extends BaseRemoveUserTradingRequestDto {}

export class RemoveFromUnlimitedResponseDto extends BaseRemoveUserTradingResponseDto {}

export class CreateUserUnlimitedRequestDto extends BaseCreateUserTradingRequestDto {}

export class UpdateUserUnlimitedRequestDto extends BaseUpdateUserTradingRequestDto {}

export class UserUnlimitedDto extends BaseUserTradingDto {}

export class GrpcUserUnlimitedPaginationResponse extends BaseGrpcUserTradingPaginationResponse<UserUnlimitedDto> {
  @ApiProperty({ name: 'data', type: [UserUnlimitedDto] })
  @Type(() => UserUnlimitedDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose()
  data: UserUnlimitedDto[] = []
}
