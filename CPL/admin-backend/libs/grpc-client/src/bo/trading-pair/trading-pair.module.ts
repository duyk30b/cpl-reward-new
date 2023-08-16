import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcTradingPairService } from './trading-pair.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_TRADING_PAIR_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_trading_pair'],
            protoPath: [getProtoPath('bo/bo-trading-pair.proto')],
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
    GrpcTradingPairService,
  ],
  exports: [GrpcTradingPairService],
})
export class GrpcTradingPairModule {}
