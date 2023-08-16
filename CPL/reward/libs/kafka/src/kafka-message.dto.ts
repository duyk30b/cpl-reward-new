import { Expose, Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class KafkaMessageDto {
  @Expose({ name: 'create_time' })
  @Transform(({ value }) => Math.floor(Number(value) / 1000))
  @IsNumber()
  createTime: number

  @Expose()
  @IsNumber()
  version: number
}
