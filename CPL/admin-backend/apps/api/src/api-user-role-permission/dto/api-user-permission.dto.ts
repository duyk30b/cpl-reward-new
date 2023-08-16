import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiAddUserPermissionDto {
  @ApiProperty({
    name: 'user_id',
    default: '1',
  })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    name: 'permission_ids',
    type: [String],
    default: ['1', '2', '3'],
  })
  @Expose({ name: 'permission_ids' })
  permissionIds: number[]
}
