import { Payload } from '@nestjs/microservices'
import { KAFKA_TOPIC_METADATA } from './kafka.const'

export function KafkaTopic(config: string) {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(KAFKA_TOPIC_METADATA, config, descriptor.value)
    return descriptor
  }
}

export function PayloadMessage() {
  return Payload('value')
}
