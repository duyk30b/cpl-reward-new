import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { CoinSettingService } from './coin-setting.service'
import { CommonSettingConstant } from '../common-setting.constant'

@Module({
  providers: [
    {
      provide: CommonSettingConstant.GRPC_COMMON_SETTING_COIN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [CommonSettingConstant.GRPC_COMMON_SETTING_COIN_PACKAGE],
            protoPath: [getProtoPath('common-setting/coin-setting.proto')],
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
    CoinSettingService,
  ],
  exports: [CoinSettingService],
})
export class CoinSettingModule {}
