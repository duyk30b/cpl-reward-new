import { KafkaTopic, KAFKA_EVENTS, MessageId } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { BceConsumerService } from './bce-consumer.service'
import { BceDepositDto } from './dto/bce-deposit.dto'
import { BceTradingMatchedDto } from './dto/bce-trading-matched.dto'
import { BceWithdrawDto } from './dto/bce-withdraw.dto'

@Controller()
export class BceConsumerController {
  constructor(private readonly bceConsumerService: BceConsumerService) {}

  @KafkaTopic(KAFKA_EVENTS.BCE_DEPOSIT)
  async handleDeposit(@Payload('value') message: BceDepositDto, @MessageId() messageId: string) {
    this.bceConsumerService.handleBceMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.BCE_DEPOSIT,
      data: message,
      createTime: message.createdAt,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.BCE_TRADING_MATCHED)
  async handleTradingMatched(
    @Payload('value') message: BceTradingMatchedDto,
    @MessageId() messageId: string,
  ) {
    this.bceConsumerService.handleBceMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.BCE_TRADING_MATCHED,
      data: message,
      createTime: Date.now(),
    })
  }

  @KafkaTopic(KAFKA_EVENTS.BCE_WITHDRAW)
  async handleWithdraw(@Payload('value') message: BceWithdrawDto, @MessageId() messageId: string) {
    this.bceConsumerService.handleBceMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.BCE_WITHDRAW,
      data: message,
      createTime: Date.now(),
    })
  }
}
