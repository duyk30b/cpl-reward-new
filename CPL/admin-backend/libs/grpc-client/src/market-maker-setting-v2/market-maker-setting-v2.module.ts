import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { GrpcMarketMakerSettingV2Service } from './market-maker-setting-v2.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    GrpcMarketMakerSettingV2Service,
    {
      provide: 'MARKET_MAKER_SETTING_V2_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['market_maker_setting_v2'],
            protoPath: [getProtoPath('market-maker-setting-v2.proto')],
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
  exports: [GrpcMarketMakerSettingV2Service],
})
export class MarketMakerSettingV2Module {}
