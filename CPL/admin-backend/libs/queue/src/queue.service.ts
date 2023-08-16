import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { JobOptions, Queue } from 'bull'
import {
  PROCESSOR_API_LANGUAGE_QUEUE,
  PROCESSOR_API_USER_QUEUE,
} from './constant'

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(PROCESSOR_API_USER_QUEUE)
    private workerUserQueue: Queue,
    @InjectQueue(PROCESSOR_API_LANGUAGE_QUEUE)
    private workerLanguageQueue: Queue,
  ) {}

  async addUserJob(name: string, data: any, opts?: JobOptions) {
    return await this.workerUserQueue.add(name, data, opts)
  }

  async addLanguageJob(name: string, data: any, opts?: JobOptions) {
    return await this.workerLanguageQueue.add(name, data, opts)
  }
}
