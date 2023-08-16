import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { Constants } from './constants'
import { GridTradingSettingService } from './services/grid-trading.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_GRID_TRADING_SETTING_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grid_trading.v1'],
            protoPath: [
              getProtoPath('grid-trading-setting/grid-trading.v1.proto'),
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
    GridTradingSettingService,
  ],
  exports: [GridTradingSettingService],
})
export class GridTradingSettingModule {}
