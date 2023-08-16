import { Module } from '@nestjs/common'
import kafkaConfig from './kafka.config'
import { ConfigModule } from '@nestjs/config'
import { KafkaConsumerService } from './kafka-consumer.service'

@Module({
  imports: [ConfigModule.forFeature(kafkaConfig)],
  providers: [KafkaConsumerService],
})
export class KafkaConsumerModule {}
