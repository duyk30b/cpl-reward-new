import { Module } from '@nestjs/common'
import kafkaConfig from './kafka.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { KafkaService } from './kafka.service'
import { KAFKA_SERVICE_TOKEN } from './kafka.const'

@Module({
  imports: [ConfigModule.forFeature(kafkaConfig)],
  providers: [
    {
      provide: KAFKA_SERVICE_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: configService.get('kafka.brokers'),
            },
            consumer: {
              groupId: `${configService.get('kafka.env')}${configService.get(
                'kafka.group',
              )}`,
            },
          },
        })
      },
      inject: [ConfigService],
    },
    KafkaService,
  ],
  exports: [KafkaService],
})
export class KafkaProducerModule {}
