import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcWinningRateService } from './winning-rate.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_WINNING_RATE_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_winning_rate_analysis'],
            protoPath: [getProtoPath('bo/bo-winning-rate-analysis.proto')],
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
    GrpcWinningRateService,
  ],
  exports: [GrpcWinningRateService],
})
export class GrpcWinningRateModule {}
