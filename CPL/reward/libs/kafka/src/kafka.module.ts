import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { KafkaProducerService } from './kafka-producer.service'
import { KafkaConfig } from './kafka.config'
import { KafkaDecoratorService } from './kafka.decorators'

@Module({})
export class KafkaModule {
  static register(appName: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [ConfigModule.forFeature(KafkaConfig)],
      providers: [
        {
          provide: 'KAFKA_SERVICE',
          inject: [KafkaConfig.KEY],
          useFactory(kafkaConfig: ConfigType<typeof KafkaConfig>) {
            return ClientProxyFactory.create({
              transport: Transport.KAFKA,
              options: {
                client: {
                  brokers: kafkaConfig.brokers,
                  clientId: `${process.env.ENV}-${process.env.KAFKA_GROUP_ID}-${appName}-client`,
                },
                producer: { allowAutoTopicCreation: true },
                consumer: {
                  groupId: `${process.env.ENV}-${process.env.KAFKA_GROUP_ID}-${appName}`,
                  allowAutoTopicCreation: true,
                },
              },
            })
          },
        },
        KafkaProducerService,
      ],
      exports: [KafkaProducerService],
    }
  }

  static registerDecorator(): DynamicModule {
    return {
      module: KafkaModule,
      imports: [ConfigModule.forFeature(KafkaConfig)],
      providers: [KafkaDecoratorService],
      exports: [],
    }
  }
}
