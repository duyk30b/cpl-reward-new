import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { MarketMakerDataPointService } from './market-maker-data-point.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    MarketMakerDataPointService,
    {
      provide: 'MARKET_MAKER_DATA_POINT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['market_maker_data_point'],
            protoPath: [getProtoPath('market-maker-data-point.proto')],
            url: configService.get('grpc_client.market_maker_admin'),
            loader: {
              keepCase: true,
            },
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
  ],
  exports: [MarketMakerDataPointService],
})
export class MarketMakerDataPointModule {}
