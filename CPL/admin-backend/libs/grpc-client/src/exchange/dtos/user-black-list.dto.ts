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

export class GetUserBlackListQuery extends GetBaseUserTradingQuery {}

export class RemoveFromBlackListRequestDto extends BaseRemoveUserTradingRequestDto {}

export class RemoveFromBlackListResponseDto extends BaseRemoveUserTradingResponseDto {}

export class CreateUserBlackListRequestDto extends BaseCreateUserTradingRequestDto {}

export class UpdateUserBlackListRequestDto extends BaseUpdateUserTradingRequestDto {}

export class UserBlackListDto extends BaseUserTradingDto {}

export class GrpcUserBlackListPaginationResponse extends BaseGrpcUserTradingPaginationResponse<UserBlackListDto> {
  @ApiProperty({ name: 'data', type: [UserBlackListDto] })
  @Type(() => UserBlackListDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose()
  data: UserBlackListDto[] = []
}
