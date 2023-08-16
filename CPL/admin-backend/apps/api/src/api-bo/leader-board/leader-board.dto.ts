import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class DeleteRequestDto {
  @ApiProperty({ name: 'key' })
  @Expose()
  @IsNotEmpty()
  key: string
}
