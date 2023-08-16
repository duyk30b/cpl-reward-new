import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetChannelByNameDto {
  @ApiProperty()
  @Expose()
  name: string
}
