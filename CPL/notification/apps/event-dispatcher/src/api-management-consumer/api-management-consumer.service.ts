import { MailTemplate } from '@libs/common'
import { BullQueueService } from '@libs/redis'
import { timeWithFormat } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { EApiKeyStatus } from './api-management-consumer.variable'
import { ApiKeyChangeStatusMessageDto } from './dto/api-key-change-status-message.dto'

@Injectable()
export class ApiManagementConsumerService {
  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleApiKeyChangeStatus(message: ApiKeyChangeStatusMessageDto) {
    const { data, createTime } = message
    const { userId, apiKey, status } = data

    const time = timeWithFormat(createTime)

    const mailData = {
      time,
      apiKey,
    }

    if (status == EApiKeyStatus.ENABLE) {
      this.bullQueueService.addMailCommand({
        userId,
        data: mailData,
        template: MailTemplate.API_KEY_ENABLED,
      })
    } else if (status == EApiKeyStatus.DISABLE) {
      this.bullQueueService.addMailCommand({
        userId,
        data: mailData,
        template: MailTemplate.API_KEY_DISABLED,
      })
    }
  }
}
