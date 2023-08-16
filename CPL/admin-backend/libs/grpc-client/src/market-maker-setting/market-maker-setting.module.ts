import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { GrpcMarketMakerSettingService } from './market-maker-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    GrpcMarketMakerSettingService,
    {
      provide: 'MARKET_MAKER_SETTING_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['market_maker_setting'],
            protoPath: [getProtoPath('market-maker-setting.proto')],
            url: configService.get('grpc_client.setting'),
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
  exports: [GrpcMarketMakerSettingService],
})
export class MarketMakerSettingModule {}
