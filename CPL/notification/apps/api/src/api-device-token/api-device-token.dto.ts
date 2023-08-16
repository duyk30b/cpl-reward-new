import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ApiRegisterTokenDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  token: string
}
