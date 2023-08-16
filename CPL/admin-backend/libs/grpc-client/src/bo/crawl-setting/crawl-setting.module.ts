import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcCrawlSettingService } from './crawl-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_CRAWL_SETTING_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [
              'bo_pair_setting',
              'bo_trading_mode',
              'bo_trading_pair',
              'bo_crawl_setting',
              'bo_setting',
            ],
            protoPath: [
              getProtoPath('bo/bo-pair-setting.proto'),
              getProtoPath('bo/bo-trading-mode-dev.proto'),
              getProtoPath('bo/bo-trading-pair.proto'),
              getProtoPath('bo/bo-crawl-setting.proto'),
              getProtoPath('bo/bo-setting.proto'),
            ],
            url: configService.get('grpc_client.bo'),
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
    GrpcCrawlSettingService,
  ],
  exports: [GrpcCrawlSettingService],
})
export class GrpcCrawlSettingModule {}
