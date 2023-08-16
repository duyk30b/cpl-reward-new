import { BullQueueService, IFilterMission } from '@lib/redis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class RewardConsumerService {
  private readonly logger = new Logger(RewardConsumerService.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleRewardMessageResult(data: IFilterMission) {
    this.logger.log(`handleRewardMessageResult: ${JSON.stringify(data)}`)
    this.bullQueueService.addFilterMissionJob(data)
  }
}
