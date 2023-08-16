import { EExchangeEvent } from '@libs/common'
import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { Controller } from '@nestjs/common'
import { ExchangeOpenOrderMessageDto } from './dto/exchange-open-order-message.dto'
import { ExchangeOrderMatchMessageDto } from './dto/exchange-order-match-message.dto'
import { ExchangeConsumerService } from './exchange-consumer.service'

@Controller()
export class ExchangeConsumerController {
  constructor(
    private readonly exchangeConsumerService: ExchangeConsumerService,
  ) {}

  @KafkaTopic(EExchangeEvent.ORDER_MATCH)
  async handleOrderMatch(
    @PayloadMessage() message: ExchangeOrderMatchMessageDto,
  ) {
    await this.exchangeConsumerService.handleOrderMatch(message)
  }

  @KafkaTopic(EExchangeEvent.OPEN_ORDER)
  async handleOpenOrder(
    @PayloadMessage() message: ExchangeOpenOrderMessageDto,
  ) {
    await this.exchangeConsumerService.handleOpenOrder(message)
  }
}
