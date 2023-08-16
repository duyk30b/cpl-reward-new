import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceTransactionService } from './balance-transaction.service'

@Module({
  providers: [
    {
      provide: 'BALANCE_TRANSACTION_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.balance.transaction.v1'],
            protoPath: [getProtoPath('balance-transaction.proto')],
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
    BalanceTransactionService,
  ],
  exports: [BalanceTransactionService],
})
export class BalanceTransactionModule {}
