import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
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
