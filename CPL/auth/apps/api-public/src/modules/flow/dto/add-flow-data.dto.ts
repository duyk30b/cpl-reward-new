import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class AddFlowDataDto {
  @ApiProperty()
  @Expose()
  data: Record<string, any>

  @ApiProperty({ name: 'file_ids' })
  @Expose({ name: 'file_ids' })
  fileIds: string[]
}
