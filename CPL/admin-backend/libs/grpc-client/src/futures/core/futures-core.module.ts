import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { FuturesConstant } from '../futures.constant'
import { FuturesCoreService } from './futures-core.service'

@Module({
  providers: [
    {
      provide: FuturesConstant.GRPC_FUTURES_CORE_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [FuturesConstant.GRPC_FUTURES_CORE_POSITION_PACKAGE],
            protoPath: [getProtoPath('futures/position.proto')],
            url: configService.get('grpc_client.futures_core'),
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
    FuturesCoreService,
  ],
  exports: [FuturesCoreService],
})
export class FuturesCoreModule {}
