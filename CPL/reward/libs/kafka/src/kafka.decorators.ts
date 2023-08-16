import { createParamDecorator, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessagePattern } from '@nestjs/microservices'
import { KAFKA_TOPIC_METADATA } from './kafka.constant'

// https://github.com/nestjs/nest/issues/3912
export function KafkaTopic(config: string) {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(KAFKA_TOPIC_METADATA, config, descriptor.value)
    return descriptor
  }
}

export const MessageId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return `topic_${request.topic}_partition_${request.partition}_offset_${request.offset}`
})

@Injectable()
export class KafkaDecoratorService {
  constructor(private readonly configService: ConfigService) {}

  processKafkaDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype)
      for (const prop of propNames) {
        const eventConfig = Reflect.getMetadata(
          KAFKA_TOPIC_METADATA,
          Reflect.get(type.prototype, prop),
        )
        if (!eventConfig) continue

        const topic = this.configService.get(`kafka.event.${eventConfig}`)
        Reflect.decorate(
          [MessagePattern(topic)],
          type.prototype,
          prop,
          Reflect.getOwnPropertyDescriptor(type.prototype, prop),
        )
      }
    }
  }
}
