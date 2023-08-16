import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientKafka } from '@nestjs/microservices'
import { instanceToPlain } from 'class-transformer'
import { currentTimestamp, stripNull } from '@libs/util'
import { KAFKA_SERVICE_TOKEN } from './kafka.const'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_SERVICE_TOKEN) private kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get('kafka.env') != 'local') {
      await this.kafkaClient.connect()
    }
  }

  async sendWithTopicFromConfig(
    topicConfigName: string,
    data: any,
    version = 1,
  ) {
    const topicName = this.configService.get(`kafka.event.${topicConfigName}`)
    return await this.send(topicName, data, version)
  }

  async send(topic: string, data: any, version = 1) {
    const message = {
      data: stripNull(instanceToPlain(data)),
      create_time: currentTimestamp(),
      version: version,
    }

    return await lastValueFrom(this.kafkaClient.emit(topic, message))
  }
}
