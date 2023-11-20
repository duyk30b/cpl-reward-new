import { BullQueueService, IFilterMission } from '@lib/redis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class HighLowConsumerService {
  private readonly logger = new Logger(HighLowConsumerService.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleHighLowMessageResult(data: IFilterMission) {
    this.logger.log(`handleHighLowMessageResult: ${JSON.stringify(data)}`)

    this.bullQueueService.addFilterMissionJob(data)
  }
}
