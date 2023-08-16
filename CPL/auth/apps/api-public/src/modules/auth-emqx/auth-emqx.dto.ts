import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class AuthEmqxDto {
  @ApiProperty()
  @Expose()
  username: string

  @ApiProperty()
  @Expose()
  clientid: string

  @ApiProperty()
  @Expose()
  password: string
}

export class AclEmqxDto {
  @ApiProperty()
  @Expose()
  access: string

  @ApiProperty()
  @Expose()
  username: string

  @ApiProperty()
  @Expose()
  clientid: string

  @ApiProperty()
  @Expose()
  ipaddr: string

  @ApiProperty()
  @Expose()
  topic: string
}
