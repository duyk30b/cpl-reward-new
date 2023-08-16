import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ImportTranslateResponse {
  @ApiProperty()
  @Expose()
  key: string

  @ApiProperty({ name: 'admin_action_id' })
  @Expose({ name: 'admin_action_id' })
  adminActionId: string
}
