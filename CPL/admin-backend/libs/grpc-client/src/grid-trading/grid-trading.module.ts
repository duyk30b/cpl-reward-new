import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { Constants } from './constants'
import { GridTradingService } from './grid-trading.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_GRID_TRADING_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grid.trading.v1.service'],
            protoPath: [
              getProtoPath(
                'grid-trading-service/grid-trading-service.v1.proto',
              ),
            ],
            url: configService.get('grpc_client.grid_trading_service'),
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
    GridTradingService,
  ],
  exports: [GridTradingService],
})
export class GridTradingModule {}
