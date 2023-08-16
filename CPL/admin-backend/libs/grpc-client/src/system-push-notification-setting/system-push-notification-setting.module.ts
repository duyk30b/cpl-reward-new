import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { SystemPushNotificationSettingService } from './system-push-notification-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'SYSTEM_PUSH_NOTI_SETTING_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['system_push_notification_setting'],
            protoPath: [getProtoPath('system_push_notification_setting.proto')],
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
    SystemPushNotificationSettingService,
  ],
  exports: [SystemPushNotificationSettingService],
})
export class SystemPushNotificationSettingModule {}
