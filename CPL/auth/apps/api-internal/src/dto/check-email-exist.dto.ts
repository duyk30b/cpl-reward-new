import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class CheckEmailExistDto {
  @ApiProperty({ name: 'except_user_id', required: false })
  @Expose({ name: 'except_user_id' })
  exceptUserId: string

  @ApiProperty()
  @Expose()
  email: string
}
