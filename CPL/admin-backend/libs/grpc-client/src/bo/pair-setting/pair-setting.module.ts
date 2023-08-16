import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcPairSettingService } from './pair-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_PAIR_SETTING_PACKAGE',
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
    GrpcPairSettingService,
  ],
  exports: [GrpcPairSettingService],
})
export class GrpcPairSettingModule {}
