import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { NotificationService } from './notification.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'NOTIFICATION_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['notification'],
            protoPath: [getProtoPath('notification.proto')],
            url: configService.get('grpc_client.notification'),
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
          },
        })
      },
      inject: [ConfigService],
    },
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
