import { KafkaTopic, PayloadMessage } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { UserConsumerService } from './user-consumer.service'
import { UserBanMessageDto } from './dto/user-ban-message.dto'
import { EUserEvent } from '@app/common'

@Controller()
export class UserConsumerController {
  constructor(private readonly userConsumerService: UserConsumerService) {}

  @KafkaTopic(EUserEvent.BAN)
  async handleUserBan(@PayloadMessage() message: UserBanMessageDto) {
    await this.userConsumerService.handleUserBan(message)
  }
}
