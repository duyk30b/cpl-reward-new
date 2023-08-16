import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcPairPriceService } from './pair-price.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_PAIR_PRICE_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_pair_price'],
            protoPath: [getProtoPath('bo/bo-pair-price.proto')],
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
    GrpcPairPriceService,
  ],
  exports: [GrpcPairPriceService],
})
export class GrpcPairPriceModule {}
