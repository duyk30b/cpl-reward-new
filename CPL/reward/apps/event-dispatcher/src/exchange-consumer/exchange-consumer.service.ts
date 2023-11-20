import { BullQueueService, IFilterMission } from '@lib/redis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class ExchangeConsumerService {
  private readonly logger = new Logger(ExchangeConsumerService.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleExchangeMessageResult(data: IFilterMission) {
    this.logger.log(`handleExchangeMessageResult: ${JSON.stringify(data)}`)

    this.bullQueueService.addFilterMissionJob(data)
  }
}
