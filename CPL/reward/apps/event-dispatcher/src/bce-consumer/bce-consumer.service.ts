import { BullQueueService, IFilterMission } from '@lib/redis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class BceConsumerService {
  private readonly logger = new Logger(BceConsumerService.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleBceMessageResult(data: IFilterMission) {
    this.logger.log(`handleBceMessageResult: ${JSON.stringify(data)}`)

    this.bullQueueService.addFilterMissionJob(data)
  }
}
