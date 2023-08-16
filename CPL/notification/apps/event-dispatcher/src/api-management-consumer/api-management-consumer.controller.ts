import { EApiManagementEvent } from '@libs/common'
import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { Controller } from '@nestjs/common'
import { ApiManagementConsumerService } from './api-management-consumer.service'
import { ApiKeyChangeStatusMessageDto } from './dto/api-key-change-status-message.dto'

@Controller()
export class ApiManagementConsumerController {
  constructor(
    private readonly apiManagementConsumerService: ApiManagementConsumerService,
  ) {}

  @KafkaTopic(EApiManagementEvent.API_KEY_CHANGE_STATUS)
  async handleApiKeyChangeStatus(
    @PayloadMessage() message: ApiKeyChangeStatusMessageDto,
  ) {
    await this.apiManagementConsumerService.handleApiKeyChangeStatus(message)
  }
}
