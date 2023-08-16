import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { CommonSettingConstant } from '../common-setting.constant'
import { BotSettingService } from './bot-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: CommonSettingConstant.GRPC_COMMON_SETTING_BOT_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [CommonSettingConstant.GRPC_COMMON_SETTING_BOT_PACKAGE],
            protoPath: [
              getProtoPath('common-setting/list-bot-setting.v2.proto'),
            ],
            url: configService.get('grpc_client.setting'),
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
    BotSettingService,
  ],
  exports: [BotSettingService],
})
export class BotSettingModule {}
