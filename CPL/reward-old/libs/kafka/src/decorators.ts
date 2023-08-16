import { ConfigService } from '@nestjs/config'

export const KAFKA_TOPIC_METADATA = '__kafka-topic'

// https://github.com/nestjs/nest/issues/3912
export function KafkaTopic(config: string | keyof ConfigService): any {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(KAFKA_TOPIC_METADATA, config, descriptor.value)
    return descriptor
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const MessageId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const eventId = `topic_${request.topic}_parition_${request.partition}_offset_${request.offset}`
    return eventId
  },
)
