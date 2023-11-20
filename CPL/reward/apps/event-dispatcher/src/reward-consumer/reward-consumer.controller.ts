import { KafkaTopic, KAFKA_EVENTS, MessageId } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { RewardUserCheckInDto } from './dto/reward-user-check-in.dto'
import { RewardConsumerService } from './reward-consumer.service'

@Controller()
export class RewardConsumerController {
  constructor(private readonly exchangeConsumerService: RewardConsumerService) {}

  @KafkaTopic(KAFKA_EVENTS.REWARD_USER_CHECK_IN)
  async handleUserCheckIn(
    @Payload('value') message: RewardUserCheckInDto,
    @MessageId() messageId: string,
  ) {
    this.exchangeConsumerService.handleRewardMessageResult({
      userId: message.data.userId,
      eventName: KAFKA_EVENTS.REWARD_USER_CHECK_IN,
      data: message,
      messageId,
      createTime: message.createTime,
    })
  }
}
