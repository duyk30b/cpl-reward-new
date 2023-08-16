import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { FuturesIntegrateService } from './futures-integrate.service'
import { FuturesConstant } from '../futures.constant'

@Module({
  providers: [
    {
      provide: FuturesConstant.GRPC_FUTURES_INTEGRATE_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [FuturesConstant.GRPC_FUTURES_INTEGRATE_PACKAGE],
            protoPath: [getProtoPath('futures/futures-integrate.v1.proto')],
            url: configService.get('grpc_client.futures_integrate'),
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
    FuturesIntegrateService,
  ],
  exports: [FuturesIntegrateService],
})
export class FuturesIntegrateModule {}
