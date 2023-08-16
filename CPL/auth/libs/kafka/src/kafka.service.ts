import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { currentTimestamp, stripNull } from '@lib/util'
import { classToPlain } from 'class-transformer'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get('env') != 'local') {
      await this.kafkaClient.connect()
    }
  }

  async sendWithTopicFromConfig(
    topicConfigName: string,
    data: any,
    version = 1,
  ) {
    const topicName = this.configService.get(`event.${topicConfigName}`)
    return await this.send(topicName, data, version)
  }

  async send(topic: string, data: any, version = 1) {
    const message = {
      data: stripNull(classToPlain(data)),
      create_time: currentTimestamp(),
      version: version,
    }

    return await lastValueFrom(this.kafkaClient.emit(topic, message))
  }
}
