import { BullQueueService, IFilterMission } from '@lib/redis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AuthConsumerService {
  private readonly logger = new Logger(AuthConsumerService.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  async handleAuthMessageResult(data: IFilterMission) {
    this.logger.log(`handleAuthMessageResult: ${JSON.stringify(data)}`)

    this.bullQueueService.addFilterMissionJob(data)
  }
}
