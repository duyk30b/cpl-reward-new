import { EMt5Event } from '@libs/common'
import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { Controller } from '@nestjs/common'
import { Mt5AccountChangePasswordMessageDto } from './dto/mt5-account-change-password-message.dto'
import { Mt5AccountCreatedMessageDto } from './dto/mt5-account-created-message.dto'
import { Mt5DepositRequestMessageDto } from './dto/mt5-deposit-request-message.dto'
import { Mt5TradeConfirmWithdrawalMessageDto } from './dto/mt5-trade-confirm-withdrawal-message.dto'
import { Mt5ConsumerService } from './mt5-consumer.service'

@Controller()
export class Mt5ConsumerController {
  constructor(private readonly mt5ConsumerService: Mt5ConsumerService) {}

  @KafkaTopic(EMt5Event.ACCOUNT_CREATED)
  async handleMt5AccountCreated(
    @PayloadMessage() message: Mt5AccountCreatedMessageDto,
  ) {
    await this.mt5ConsumerService.handleMt5AccountCreated(message)
  }

  @KafkaTopic(EMt5Event.ACCOUNT_CHANGE_PASSWORD)
  async handleMt5AccountChangePassword(
    @PayloadMessage() message: Mt5AccountChangePasswordMessageDto,
  ) {
    await this.mt5ConsumerService.handleMt5AccountChangePassword(message)
  }

  @KafkaTopic(EMt5Event.TRADE_CONFIRM_WITHDRAWAL)
  async handleMt5TradeConfirmWithdrawal(
    @PayloadMessage() message: Mt5TradeConfirmWithdrawalMessageDto,
  ) {
    await this.mt5ConsumerService.handleMt5TradeConfirmWithdrawal(message)
  }

  @KafkaTopic(EMt5Event.DEPOSIT_REQUEST)
  async handleMt5DepositRequest(
    @PayloadMessage() message: Mt5DepositRequestMessageDto,
  ) {
    await this.mt5ConsumerService.handleMt5DepositRequest(message)
  }
}
