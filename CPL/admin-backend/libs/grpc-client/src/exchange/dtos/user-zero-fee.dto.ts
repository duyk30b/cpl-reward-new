import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import {
  BaseGrpcUserTradingPaginationResponse,
  BaseUpdateUserTradingRequestDto,
  BaseUserTradingDto,
  GetBaseUserTradingQuery,
} from './base-user-trading.dto'

export class GetUserZeroFeeQuery extends GetBaseUserTradingQuery {}

export class ZeroFeePairDto {
  @ApiPropertyOptional({ name: 'coin' })
  @Expose({ name: 'coin' })
  @IsString()
  coin: string

  @ApiPropertyOptional({ name: 'currency' })
  @Expose({ name: 'currency' })
  @IsString()
  currency: string
}

export class UpdateUserZeroFeeRequestDto extends BaseUpdateUserTradingRequestDto {
  @Expose({ name: 'email' })
  @IsEmail()
  email: string

  @ApiPropertyOptional({ name: 'pairs', isArray: true, type: ZeroFeePairDto })
  @Expose({ name: 'pairs' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  pairs: ZeroFeePairDto[]
}

export class UpdateUserZeroFeeResponseDto {
  @Expose({ name: 'status' })
  @IsNumber()
  status: number
}

export class UserZeroFeeDto extends BaseUserTradingDto {}

export class UserZeroFeeWithPairsDto extends UserZeroFeeDto {
  @ApiProperty({ name: 'pairs' })
  @Expose({ name: 'pairs' })
  @IsString()
  pairs: string
}

export class GrpcUserZeroFeePaginationResponse extends BaseGrpcUserTradingPaginationResponse<UserZeroFeeWithPairsDto> {
  @ApiProperty({ name: 'data', type: [UserZeroFeeWithPairsDto] })
  @Type(() => UserZeroFeeWithPairsDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose()
  data: UserZeroFeeWithPairsDto[] = []
}
