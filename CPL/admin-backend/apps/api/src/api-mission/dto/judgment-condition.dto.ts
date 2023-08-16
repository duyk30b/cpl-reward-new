import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class JudgmentConditionDto {
  @ApiProperty({ type: String, required: true })
  @Expose({ name: 'event_name' })
  @IsNotEmpty()
  eventName: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  property: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  operator: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  value: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  type: string
}
