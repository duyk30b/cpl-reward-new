import { stripNullObject } from '@lib/common/helpers/object.helper'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaProducerService {
  private readonly logger = new Logger(KafkaProducerService.name)

  constructor(@Inject('KAFKA_SERVICE') private clientKafka: ClientKafka) {}

  async onModuleInit() {
    try {
      await this.clientKafka.connect()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async sendMessage(topic: string, data: any, version = 1) {
    const message = {
      data: stripNullObject(data),
      create_time: Date.now(),
      version,
    }

    return await lastValueFrom(this.clientKafka.emit(topic, message))
  }
}
