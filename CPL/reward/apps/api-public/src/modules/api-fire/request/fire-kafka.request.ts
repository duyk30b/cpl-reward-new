import { KafkaConfig } from '@lib/kafka'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { Allow, IsNumber, IsString } from 'class-validator'
import * as dotenv from 'dotenv'

dotenv.config()
const topics = Object.values(KafkaConfig().event)

export class FireKafkaQuery {
  @ApiProperty({ name: 'topic_name', enum: topics, example: topics[9] })
  @Expose({ name: 'topic_name' })
  @IsString()
  topicName: string

  @ApiProperty({ name: 'user_id_start', example: 58000 })
  @Expose({ name: 'user_id_start' })
  @Type(() => Number)
  @IsNumber()
  userIdStart: number

  @ApiProperty({ name: 'user_id_end', example: 58010 })
  @Expose({ name: 'user_id_end' })
  @Type(() => Number)
  @IsNumber()
  userIdEnd: number

  @ApiProperty({ name: 'gap', example: 100 })
  @Expose({ name: 'gap' })
  @Type(() => Number)
  @IsNumber()
  gap: number
}

export class FireKafkaBody {
  @ApiProperty({
    name: 'data',
    example: {
      user_id: '58931',
      device: {
        created_at: 1678949040168,
        updated_at: 1681118057292,
        id: '687',
        uuid: 'b78c17ee-bd54-4d38-b42c-be875d9da8bd',
        device_hash: '87067758b257a4316d9566698d3757e0',
        device_info: {
          visitorId: '87067758b257a4316d9566698d3757e0',
          platform: {
            value: 'Windows 11',
            duration: 0,
          },
          browserName: 'Chrome',
          browserVersion: '110.0.0.0',
          timezone: {
            value: 'Asia/Saigon',
            duration: 41,
          },
          screenResolution: {
            value: [1920, 1080],
            duration: 0,
          },
          audio: {
            value: 124.04347527516074,
            duration: 5,
          },
        },
      },
      lang: 'en',
      ip: '18.140.232.78',
      is_register: true,
      time: 1681197799331,
    },
  })
  @Expose({ name: 'data' })
  @Allow()
  data: Record<string, any>

  @ApiProperty({ name: 'create_time', example: 1681200867151 })
  @Expose({ name: 'create_time' })
  @Allow()
  create_time: number

  @ApiProperty({ name: 'version', example: 1 })
  @Expose({ name: 'version' })
  @Allow()
  version: number
}
