import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { GBalanceHistoryService } from './balance-history.service'

@Module({
  providers: [
    {
      provide: 'BALANCE_HISTORY_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.balance.history.v1'],
            protoPath: [getProtoPath('balance-history.proto')],
            url: configService.get('grpc_client.balance'),
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
    GBalanceHistoryService,
  ],
  exports: [GBalanceHistoryService],
})
export class BalanceHistoryModule {}
