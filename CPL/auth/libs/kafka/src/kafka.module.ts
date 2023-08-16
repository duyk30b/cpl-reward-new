import { DynamicModule, Module } from '@nestjs/common'
import { KafkaService } from './kafka.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import event from 'config/event'
import global_config from 'config/global_config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'

@Module({})
export class KafkaModule {
  static register(): DynamicModule {
    return {
      module: KafkaModule,
      imports: [ConfigModule.forRoot({ load: [event, global_config] })],
      providers: [
        {
          provide: 'KAFKA_SERVICE',
          useFactory: (configService: ConfigService) => {
            return ClientProxyFactory.create({
              transport: Transport.KAFKA,
              options: {
                client: {
                  brokers: configService.get('kafka_brokers'),
                },
                consumer: {
                  groupId: configService.get('env') + '.auth',
                },
              },
            })
          },
          inject: [ConfigService],
        },
        KafkaService,
      ],
      exports: [KafkaService],
    }
  }
}
