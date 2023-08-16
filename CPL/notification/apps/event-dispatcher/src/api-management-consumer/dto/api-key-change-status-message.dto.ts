import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { EApiKeyStatus } from '../api-management-consumer.variable'

export class ApiKeyChangeStatusMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'api_key' })
  @IsNotEmpty()
  apiKey: string

  @Expose()
  @IsNotEmpty()
  status: EApiKeyStatus
}

export class ApiKeyChangeStatusMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => ApiKeyChangeStatusMessageDataDto)
  data: ApiKeyChangeStatusMessageDataDto
}
