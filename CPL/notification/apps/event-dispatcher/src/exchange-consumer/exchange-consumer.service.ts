import { NotificationAggregateService } from '@libs/notification-aggregate'
import { RedisService } from '@libs/redis'
import { ESystemPushNotificationType } from '@libs/system-push-notification-setting'
import { currentTimestamp } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ExchangeOpenOrderMessageDto } from './dto/exchange-open-order-message.dto'
import {
  DataOrderSideDto,
  ExchangeOrderMatchMessageDto,
} from './dto/exchange-order-match-message.dto'
import {
  ExchangeUserType,
  OrderClass,
  OrderStatus,
} from './exchange-consumer.variable'

@Injectable()
export class ExchangeConsumerService {
  constructor(
    private readonly notificationAggregateService: NotificationAggregateService,
    private readonly redisService: RedisService,
  ) {}

  async handleOrderMatch(message: ExchangeOrderMatchMessageDto) {
    const { data, createTime } = message
    // Nếu message cũ quá thì không bắn push nữa
    if (createTime < currentTimestamp() - 15 * 60 * 1000) return
    const dataOrder = data.order
    const { origin, match } = dataOrder

    await Promise.all([
      this.handleSideOfOrderMatch(origin),
      this.handleSideOfOrderMatch(match),
    ])
  }

  async handleOpenOrder(message: ExchangeOpenOrderMessageDto) {
    const { data, createTime } = message
    // Nếu message cũ quá thì không bắn push nữa
    if (createTime < currentTimestamp() - 15 * 60 * 1000) return
    const {
      userId,
      currency,
      coin,
      userType,
      realOrderClass,
      orderType,
      status,
    } = data

    if (userType != ExchangeUserType.USER) return

    // open stop limit order
    if (
      realOrderClass != OrderClass.STOP_LIMIT ||
      status != OrderStatus.PENDING
    )
      return

    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER,
      {
        ExOrder_Pair: `${coin}/${currency}`,
        ExOrder_Type: realOrderClass,
        ExOrder_Side: orderType,
      },
      {
        type: 'open_orders',
      },
    )
  }

  private async handleSideOfOrderMatch(side: DataOrderSideDto) {
    const {
      orderId,
      userId,
      currency,
      coin,
      userType,
      realOrderClass,
      orderType,
      status,
    } = side

    if (userType != ExchangeUserType.USER) return

    if (status != OrderStatus.FILLED) return

    if (realOrderClass == OrderClass.MARKET) return

    const processedKey = `order:matched:${orderId}`
    const processed = await this.redisService.get(processedKey)
    if (processed) return

    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      ESystemPushNotificationType.ORDER_COMPLETED,
      {
        ExOrder_Pair: `${coin}/${currency}`,
        ExOrder_Type: realOrderClass,
        ExOrder_Side: orderType,
        ExOrder_Status: status,
      },
      {
        type: 'order_history',
      },
    )

    await this.redisService.set(processedKey, 1, 86400)
  }
}
