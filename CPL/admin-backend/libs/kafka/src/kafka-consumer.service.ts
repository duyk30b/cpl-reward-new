import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventPattern } from '@nestjs/microservices'
import { KAFKA_TOPIC_METADATA } from './kafka.const'

@Injectable()
export class KafkaConsumerService {
  constructor(private readonly configService: ConfigService) {}

  processKafkaDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype)
      for (const prop of propNames) {
        const eventConfig = Reflect.getMetadata(
          KAFKA_TOPIC_METADATA,
          Reflect.get(type.prototype, prop),
        )

        if (eventConfig) {
          const topic = this.configService.get(`kafka.event.${eventConfig}`)
          Reflect.decorate(
            [EventPattern(topic)],
            type.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.prototype, prop),
          )
        }
      }
    }
  }
}
