import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { Constants } from './constants'
import {
  CoinSettingService,
  PairCategorySettingService,
  PairSettingService,
} from './services'
import { SubCategorySettingService } from './services/sub-category-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_EXCHANGE_SETTING_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [
              'exchange_v2',
              'coin',
              'pair_category',
              'sub_pair_category',
            ],
            protoPath: [
              getProtoPath('exchange-setting/pair-setting.proto'),
              getProtoPath('exchange-setting/pair-category-setting.proto'),
              getProtoPath('exchange-setting/sub-pair-category-setting.proto'),
              getProtoPath('common-setting/coin-setting.proto'),
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
    CoinSettingService,
    PairSettingService,
    PairCategorySettingService,
    SubCategorySettingService,
  ],
  exports: [
    CoinSettingService,
    PairSettingService,
    PairCategorySettingService,
    SubCategorySettingService,
  ],
})
export class ExchangeSettingModule {}
