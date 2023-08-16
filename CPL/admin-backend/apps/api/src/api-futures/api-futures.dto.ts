import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { Position } from '@lib/grpc-client/futures/core/futures-core.dto'
import { Error } from '@lib/grpc-client/futures/core/futures-core-pagination.dto'

export class OpenPositionResponse extends BasePaginationDto<Position[]> {
  @ApiProperty({ name: 'data', type: [Position] })
  @Type(() => Position)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose()
  data: Position[] = []

  @ApiProperty({ name: 'pagination', type: Error })
  @Type(() => Error)
  @ValidateNested()
  error: Error
}
