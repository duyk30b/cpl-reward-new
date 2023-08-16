import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceSwapHistoryService } from './balance-swap-history.service'
import { BalanceSwapHistoryConstant } from './balance-swap-history.constant'

@Module({
  providers: [
    {
      provide: BalanceSwapHistoryConstant.GRPC_BALANCE_SWAP_HISTORY_PACKAGE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.swap.v1'],
            protoPath: [getProtoPath('balance-swap-history.proto')],
            url: configService.get('grpc_client.balance_convert'),
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
    BalanceSwapHistoryService,
  ],
  exports: [BalanceSwapHistoryService],
})
export class BalanceSwapHistoryModule {}
