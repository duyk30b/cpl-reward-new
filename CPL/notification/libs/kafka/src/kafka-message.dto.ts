import { Expose, Type } from 'class-transformer'
import { IKafkaPayload } from './kafka.interface'

export class KafkaMessageDto {
  @Expose()
  data: Record<string, any>

  @Expose({ name: 'create_time' })
  @Type(() => Number)
  createTime: number

  @Expose()
  version: number
}

export class KafkaPayloadDto implements IKafkaPayload {
  @Expose()
  topic: string

  @Expose()
  partition: number

  @Expose()
  timestamp: string

  @Expose()
  size: number

  @Expose()
  attributes: number

  @Expose()
  offset: string

  @Expose()
  key: any

  @Expose()
  value: KafkaMessageDto

  @Expose()
  headers: Record<string, any>
}
