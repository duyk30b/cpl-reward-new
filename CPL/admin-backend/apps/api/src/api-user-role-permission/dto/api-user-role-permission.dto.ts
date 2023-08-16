import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ApiGetUserRolePermissionDto {
  @ApiProperty({
    name: 'user_id',
    default: '1',
  })
  @Expose({ name: 'user_id' })
  userId: string
}
