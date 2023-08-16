import { formatHighLowTimeFrame } from '@libs/common'
import { NotificationAggregateService } from '@libs/notification-aggregate'
import { ESystemPushNotificationType } from '@libs/system-push-notification-setting'
import { BO_ORDER_HISTORY_PATH } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HighLowResultMessageDto } from './dto/high-low-result-message.dto'

const ModeMap = {
  T: 'Lightning',
  TS: 'Lightning Spread',
  H: 'High/Low',
  HS: 'High/Low Spread',
  L: 'Spread',
}

@Injectable()
export class HighLowConsumerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationAggregateService: NotificationAggregateService,
  ) {}

  async handleHighLowResult(message: HighLowResultMessageDto, status: string) {
    const { userId, mode, pair } = message
    const modeName = ModeMap[mode.mode] || 'Unknown'
    const { period } = mode

    if (this.checkSmallPeriod(period)) return

    const timeFrame = formatHighLowTimeFrame(mode.period)

    const boOrderHistoryLink = `${this.configService.get(
      'global.bo_frontend_link',
    )}${BO_ORDER_HISTORY_PATH}`

    await this.notificationAggregateService.sendSystemNotificationToUser(
      userId,
      ESystemPushNotificationType.HIGH_LOW_COMPLETE,
      {
        Mode: modeName,
        TimeFrame: timeFrame,
        Pair: pair.symbol,
        Status: status,
      },
      {
        link: boOrderHistoryLink,
      },
    )
  }

  private checkSmallPeriod(period: string) {
    if (!period) return true
    const [hour, minute] = period.split(':').map((e) => parseInt(e))
    if (hour) return false
    if (minute >= 5) return false
    return true
  }
}
