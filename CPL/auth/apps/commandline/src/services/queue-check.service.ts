import { RedisQueueService } from '@lib/redis-queue'
import { Logger } from '@nestjs/common'
import { Command } from 'nest-commander'

@Command({ name: 'queue:check' })
export class QueueCheckService {
  private readonly logger = new Logger(QueueCheckService.name)

  constructor(private readonly redisQueueService: RedisQueueService) {}

  async run(passedParam: string[]): Promise<void> {
    const result = await this.redisQueueService.getStatus()
    this.logger.log(result)
    process.exit(0)
  }
}
