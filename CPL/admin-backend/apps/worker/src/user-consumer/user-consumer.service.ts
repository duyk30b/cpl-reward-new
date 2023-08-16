import { ExternalBceService } from '@lib/external-bce'
import { Injectable, Logger } from '@nestjs/common'
import { UserBanMessageDto } from './dto/user-ban-message.dto'

@Injectable()
export class UserConsumerService {
  private readonly logger = new Logger(UserConsumerService.name)
  constructor(private readonly externalBceService: ExternalBceService) {}

  async handleUserBan(message: UserBanMessageDto) {
    const data = message.data
    const { userId, auto } = data
    if (!auto) return

    this.logger.log(`Auto ban user: ${userId}`)
    const requestLogInfo = {
      adminId: '0',
      userAgent: 'kafka',
      ip: null,
    }
    await this.externalBceService.cancelWithdraw(userId, requestLogInfo)
    await this.externalBceService.cancelOrder(userId, requestLogInfo)
  }
}
