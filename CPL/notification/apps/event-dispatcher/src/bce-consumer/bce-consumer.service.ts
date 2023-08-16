import { NotificationAggregateService } from '@libs/notification-aggregate'
import { RedisService } from '@libs/redis'
import { ESystemPushNotificationType } from '@libs/system-push-notification-setting'
import { Injectable } from '@nestjs/common'
import { BceDepositMessageDto } from './dto/bce-deposit-message.dto'
import { BceDividendMessageDto } from './dto/bce-dividend-message.dto'
import { BceTradingMessageDto } from './dto/bce-trading-message.dto'
import { BceWithdrawMessageDto } from './dto/bce-withdraw-message.dto'
import { absNumberString } from '@libs/util'

@Injectable()
export class BceConsumerService {
  constructor(
    private readonly notificationAggregateService: NotificationAggregateService,
    private readonly redisService: RedisService,
  ) {}

  async handleBceDeposit(message: BceDepositMessageDto) {
    const data = message.data
    const { userId, currency, amount } = data
    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      ESystemPushNotificationType.DEPOSIT,
      {
        Deposit_Currency: currency,
        Deposit_Quantity: amount,
      },
      {
        type: 'deposit',
      },
    )
  }

  async handleBceWithdraw(message: BceWithdrawMessageDto) {
    const data = message.data
    const { userId, currency, amount, currencyFee, fee, status } = data
    const type =
      status == 'success'
        ? ESystemPushNotificationType.WITHDRAW_SUCCESS
        : ESystemPushNotificationType.WITHDRAW_REJECTED
    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      type,
      {
        Withdrawal_Currency: currency,
        Withdrawal_Quantity: absNumberString(amount),
        Withdrawal_Fee_Currency: currencyFee,
        Withdrawal_Fee: fee,
        Withdrawal_Status: status,
      },
      {
        type: 'withdrawal',
      },
    )
  }

  async handleBceDividend(message: BceDividendMessageDto) {
    const data = message.data
    const { userId, currency, amount } = data
    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      ESystemPushNotificationType.DIVIDEND,
      {
        Dividend_Currency: currency,
        Dividend_Amount: amount,
      },
    )
  }

  async handleBceTrading(message: BceTradingMessageDto) {
    const data = message.data
    const { userId, currency, coin, type, tradeType, status, orderId } = data

    const eventKey = `event_key:bce_trading:${orderId}-${status}`

    // Handle BCE duplicate event
    const duplicate = await this.redisService.get(eventKey)
    if (duplicate) return

    if (type == 'stop_limit' && status == 'pending') {
      await this.notificationAggregateService.sendSystemNotificationToUser(
        userId,
        ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER,
        {
          ExOrder_Pair: `${coin}/${currency}`,
          ExOrder_Type: type,
          ExOrder_Side: tradeType,
        },
        {
          type: 'open_orders',
        },
      )
    } else if (status == 'executed') {
      await this.notificationAggregateService.sendSystemNotificationToUser(
        userId,
        ESystemPushNotificationType.ORDER_COMPLETED,
        {
          ExOrder_Pair: `${coin}/${currency}`,
          ExOrder_Type: type,
          ExOrder_Side: tradeType,
          ExOrder_Status: status,
        },
        {
          type: 'order_history',
        },
      )
    }

    await this.redisService.set(eventKey, 1, 60)
  }
}
