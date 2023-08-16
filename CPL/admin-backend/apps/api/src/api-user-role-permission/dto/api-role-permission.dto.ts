import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiAddRolePermissionDto {
  @ApiProperty({
    name: 'role_id',
    default: '1',
  })
  @Expose({ name: 'role_id' })
  @IsNotEmpty()
  roleId: string

  @ApiProperty({
    name: 'permission_ids',
    type: [String],
    default: ['1', '2', '3'],
  })
  @Expose({ name: 'permission_ids' })
  permissionIds: number[]
}
