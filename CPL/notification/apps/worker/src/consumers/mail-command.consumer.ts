import { MAIL_COMMAND_QUEUE, IMailCommand } from '@libs/redis'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerMailService } from '../services/worker-mail.service'

@Processor(MAIL_COMMAND_QUEUE)
export class MailConsumer {
  constructor(private readonly workerMailService: WorkerMailService) {}

  @Process()
  handleMailCommand(job: Job<IMailCommand>) {
    this.workerMailService.handleMailCommand(job.data)
  }
}
