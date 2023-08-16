import { PUSH_COMMAND_QUEUE, IUserPushCommand } from '@libs/redis'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerPushService } from '../services/worker-push.service'

@Processor(PUSH_COMMAND_QUEUE)
export class PushConsumer {
  constructor(private readonly workerPushService: WorkerPushService) {}

  @Process()
  handleUserPushCommand(job: Job<IUserPushCommand>) {
    this.workerPushService.handleUserPushCommand(job.data)
  }
}
