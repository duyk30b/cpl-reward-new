import { MailTemplate } from '@libs/common'
import { BullQueueService } from '@libs/redis'
import { Injectable } from '@nestjs/common'
import { Mt5AccountChangePasswordMessageDto } from './dto/mt5-account-change-password-message.dto'
import { Mt5AccountCreatedMessageDto } from './dto/mt5-account-created-message.dto'
import { Mt5DepositRequestMessageDto } from './dto/mt5-deposit-request-message.dto'
import { Mt5TradeConfirmWithdrawalMessageDto } from './dto/mt5-trade-confirm-withdrawal-message.dto'

@Injectable()
export class Mt5ConsumerService {
  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleMt5AccountCreated(message: Mt5AccountCreatedMessageDto) {
    const { data } = message
    const {
      userId,
      login: id,
      password,
      server,
      mt5TerminalUrl,
      webTraderUrl,
      depositUrl,
      accountType,
      balance,
    } = data

    const mailData = {
      userId,
      id,
      password,
      server,
      mt5TerminalUrl,
      webTraderUrl,
      depositUrl,
      accountType,
      balance,
    }

    this.bullQueueService.addMailCommand({
      userId,
      data: mailData,
      template: MailTemplate.MT5_ACCOUNT_CREATED,
    })
  }

  async handleMt5AccountChangePassword(
    message: Mt5AccountChangePasswordMessageDto,
  ) {
    const { data } = message
    const { userId, otp } = data

    const mailData = {
      otp,
    }

    this.bullQueueService.addMailCommand({
      userId,
      data: mailData,
      template: MailTemplate.MT5_ACCOUNT_CHANGE_PASSWORD,
    })
  }

  async handleMt5TradeConfirmWithdrawal(
    message: Mt5TradeConfirmWithdrawalMessageDto,
  ) {
    const { data } = message
    const { adminEmail } = data

    if (!adminEmail?.length) return

    const mailData = data

    adminEmail.forEach((email) => {
      this.bullQueueService.addMailCommand({
        email,
        data: mailData,
        template: MailTemplate.MT5_TRADE_CONFIRM_WITHDRAWAL,
      })
    })
  }

  async handleMt5DepositRequest(message: Mt5DepositRequestMessageDto) {
    const { data } = message
    const { adminEmail } = data

    if (!adminEmail?.length) return

    const mailData = data

    adminEmail.forEach((email) => {
      this.bullQueueService.addMailCommand({
        email,
        data: mailData,
        template: MailTemplate.MT5_DEPOSIT_REQUEST,
      })
    })
  }
}
