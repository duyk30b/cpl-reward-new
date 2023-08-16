import { EBceEvent } from '@libs/common'
import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { Controller } from '@nestjs/common'
import { BceConsumerService } from './bce-consumer.service'
import { BceDepositMessageDto } from './dto/bce-deposit-message.dto'
import { BceDividendMessageDto } from './dto/bce-dividend-message.dto'
import { BceTradingMessageDto } from './dto/bce-trading-message.dto'
import { BceWithdrawMessageDto } from './dto/bce-withdraw-message.dto'

@Controller()
export class BceConsumerController {
  constructor(private readonly bceConsumerService: BceConsumerService) {}

  @KafkaTopic(EBceEvent.DEPOSIT)
  async handleBceDeposit(@PayloadMessage() message: BceDepositMessageDto) {
    await this.bceConsumerService.handleBceDeposit(message)
  }

  @KafkaTopic(EBceEvent.WITHDRAW)
  async handleBceWithdraw(@PayloadMessage() message: BceWithdrawMessageDto) {
    await this.bceConsumerService.handleBceWithdraw(message)
  }

  @KafkaTopic(EBceEvent.DIVIDEND)
  async handleBceDividend(@PayloadMessage() message: BceDividendMessageDto) {
    await this.bceConsumerService.handleBceDividend(message)
  }

  @KafkaTopic(EBceEvent.TRADING)
  async handleBceTrading(@PayloadMessage() message: BceTradingMessageDto) {
    await this.bceConsumerService.handleBceTrading(message)
  }
}
