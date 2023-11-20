import { KafkaTopic, KAFKA_EVENTS, MessageId } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import {
  ExchangeConfirmOrderMatchDto,
  OrderMatch,
  OrderOrigin,
} from './dto/exchange-confirm-order-match.dto'
import { ExchangeConsumerService } from './exchange-consumer.service'

@Controller()
export class ExchangeConsumerController {
  constructor(private readonly exchangeConsumerService: ExchangeConsumerService) {}

  @KafkaTopic(KAFKA_EVENTS.EXCHANGE_CONFIRM_ORDER_MATCH)
  async handleConfirmOrderMatch(
    @Payload('value') message: ExchangeConfirmOrderMatchDto,
    @MessageId() messageId: string,
  ) {
    enum UserType {
      User = 1,
      BotA = 2,
      BotP = 3,
      Gatekeeper = 4,
    }

    const origin: OrderOrigin = message.data?.order?.origin || ({} as any)
    if (origin.userType === UserType.User) {
      await this.exchangeConsumerService.handleExchangeMessageResult({
        messageId,
        userId: origin.userId,
        eventName: KAFKA_EVENTS.EXCHANGE_CONFIRM_ORDER_MATCH,
        data: {
          tradeType: origin.orderType,
          userId: origin.userId,
          currency: origin.currency,
          coin: origin.coin,
          quantity: message.data.filled.grossVolume,
        },
        createTime: message.createTime,
      })
    }

    const match: OrderMatch = message.data?.order?.match || ({} as any)
    if (match.userType === UserType.User) {
      await this.exchangeConsumerService.handleExchangeMessageResult({
        messageId,
        userId: match.userId,
        eventName: KAFKA_EVENTS.EXCHANGE_CONFIRM_ORDER_MATCH,
        data: {
          tradeType: match.orderType,
          userId: match.userId,
          currency: match.currency,
          coin: match.coin,
          quantity: message.data.filled.grossVolume,
        },
        createTime: message.createTime,
      })
    }
  }
}
