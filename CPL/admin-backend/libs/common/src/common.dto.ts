import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class IApiBadRequestResponse {
  @Expose()
  @ApiProperty({ type: Number })
  status: number

  @Expose()
  @ApiProperty({ type: String })
  message: string

  @Expose()
  @ApiProperty({ type: [] })
  errors: []
}
