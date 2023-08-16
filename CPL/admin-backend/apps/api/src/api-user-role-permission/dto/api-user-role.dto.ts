import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiCreateUserRoleDto {
  @ApiProperty({
    name: 'user_id',
    default: '1',
  })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    name: 'role_id',
    default: '1',
  })
  @Expose({ name: 'role_id' })
  roleId: string
}
